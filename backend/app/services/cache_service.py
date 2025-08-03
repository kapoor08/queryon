import redis.asyncio as redis
import json
import hashlib
import logging
import asyncio
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from ..core.config import settings

logger = logging.getLogger(__name__)


class CacheService:
    def __init__(self):
        self.redis_client = None
        self._redis_lock = asyncio.Lock()
        self.default_ttl = settings.CACHE_TTL

    async def _get_redis_client(self):
        """Get Redis client with connection pooling"""
        if self.redis_client is None:
            async with self._redis_lock:
                if self.redis_client is None:
                    try:
                        self.redis_client = redis.from_url(
                            settings.REDIS_URL,
                            decode_responses=True,
                            retry_on_timeout=True,
                            health_check_interval=30,
                            socket_keepalive=True,
                            socket_keepalive_options={},
                        )
                        # Test connection
                        await self.redis_client.ping()
                        logger.info("✅ Redis cache service connected")
                    except Exception as e:
                        logger.error(f"Failed to connect to Redis for caching: {e}")
                        self.redis_client = None
        return self.redis_client

    def _generate_cache_key(self, widget_id: str, query: str) -> str:
        """Generate cache key for query"""
        # Normalize query for better cache hits
        normalized_query = query.lower().strip()
        # Remove extra whitespace and common punctuation
        normalized_query = " ".join(normalized_query.split())
        normalized_query = (
            normalized_query.replace("?", "").replace("!", "").replace(".", "")
        )

        query_hash = hashlib.md5(normalized_query.encode()).hexdigest()
        return f"cache:widget:{widget_id}:query:{query_hash}"

    def _generate_widget_pattern(self, widget_id: str) -> str:
        """Generate pattern to match all cache keys for a widget"""
        return f"cache:widget:{widget_id}:*"

    async def get_cached_response(self, widget_id: str, query: str) -> Optional[str]:
        """Get cached response for query"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return None

            cache_key = self._generate_cache_key(widget_id, query)
            cached_data = await redis_client.get(cache_key)

            if cached_data:
                try:
                    data = json.loads(cached_data)

                    # Check if cache entry has expired (additional safety)
                    cached_time = datetime.fromisoformat(
                        data.get("cached_at", "1970-01-01")
                    )
                    if datetime.utcnow() - cached_time > timedelta(
                        seconds=self.default_ttl
                    ):
                        await redis_client.delete(cache_key)
                        return None

                    # Update cache hit counter
                    hit_key = f"cache:stats:widget:{widget_id}:hits"
                    await redis_client.incr(hit_key)
                    await redis_client.expire(hit_key, 86400)  # Daily stats

                    return data.get("response")
                except json.JSONDecodeError:
                    # Invalid JSON, delete the key
                    await redis_client.delete(cache_key)
                    return None

            return None

        except Exception as e:
            logger.error(f"Cache retrieval failed: {e}")
            return None

    async def cache_response(
        self,
        widget_id: str,
        query: str,
        response: str,
        ttl: int = None,
        metadata: Dict = None,
    ) -> bool:
        """Cache response for query"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return False

            # Don't cache very short or error responses
            if len(response.strip()) < 10 or "error" in response.lower():
                return False

            cache_key = self._generate_cache_key(widget_id, query)
            cache_data = {
                "response": response,
                "widget_id": widget_id,
                "query": query,
                "cached_at": datetime.utcnow().isoformat(),
                "metadata": metadata or {},
            }

            ttl = ttl or self.default_ttl

            # Use pipeline for atomic operation
            pipe = redis_client.pipeline()
            pipe.setex(cache_key, ttl, json.dumps(cache_data))

            # Update cache stats
            stats_key = f"cache:stats:widget:{widget_id}:total"
            pipe.incr(stats_key)
            pipe.expire(stats_key, 86400)  # Daily stats

            await pipe.execute()

            logger.debug(f"Cached response for widget {widget_id}")
            return True

        except Exception as e:
            logger.error(f"Cache storage failed: {e}")
            return False

    async def invalidate_widget_cache(self, widget_id: str) -> int:
        """Invalidate all cached responses for a widget"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return 0

            pattern = self._generate_widget_pattern(widget_id)

            # Use scan for better performance with large key sets
            deleted_count = 0
            async for key in redis_client.scan_iter(match=pattern, count=100):
                await redis_client.delete(key)
                deleted_count += 1

            if deleted_count > 0:
                logger.info(
                    f"Invalidated {deleted_count} cache entries for widget {widget_id}"
                )

            return deleted_count

        except Exception as e:
            logger.error(f"Cache invalidation failed: {e}")
            return 0

    async def invalidate_cache_by_pattern(self, pattern: str) -> int:
        """Invalidate cache entries matching a pattern"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return 0

            deleted_count = 0
            async for key in redis_client.scan_iter(match=pattern, count=100):
                await redis_client.delete(key)
                deleted_count += 1

            logger.info(
                f"Invalidated {deleted_count} cache entries matching pattern: {pattern}"
            )
            return deleted_count

        except Exception as e:
            logger.error(f"Pattern cache invalidation failed: {e}")
            return 0

    async def get_cache_stats(self, widget_id: str) -> Dict:
        """Get cache statistics for widget"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return {"cached_queries": 0, "widget_id": widget_id, "hit_rate": 0}

            # Get cache stats
            hits_key = f"cache:stats:widget:{widget_id}:hits"
            total_key = f"cache:stats:widget:{widget_id}:total"

            hits = await redis_client.get(hits_key)
            total = await redis_client.get(total_key)

            hits = int(hits) if hits else 0
            total = int(total) if total else 0

            # Count current cached entries
            pattern = self._generate_widget_pattern(widget_id)
            cached_count = 0
            async for _ in redis_client.scan_iter(match=pattern, count=100):
                cached_count += 1

            hit_rate = (hits / total * 100) if total > 0 else 0

            return {
                "cached_queries": cached_count,
                "widget_id": widget_id,
                "cache_hits": hits,
                "total_requests": total,
                "hit_rate": round(hit_rate, 2),
            }

        except Exception as e:
            logger.error(f"Failed to get cache stats: {e}")
            return {"cached_queries": 0, "widget_id": widget_id, "hit_rate": 0}

    async def warm_cache(self, widget_id: str, common_queries: List[str]) -> int:
        """Pre-warm cache with common queries"""
        try:
            cached_count = 0

            for query in common_queries:
                # Check if already cached
                if await self.get_cached_response(widget_id, query):
                    continue

                # This would need integration with your chat service
                # For now, just log the intent
                logger.info(f"Would warm cache for query: {query}")
                cached_count += 1

            return cached_count

        except Exception as e:
            logger.error(f"Cache warming failed: {e}")
            return 0

    async def set_cache_ttl(self, widget_id: str, query: str, new_ttl: int) -> bool:
        """Update TTL for a specific cached query"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return False

            cache_key = self._generate_cache_key(widget_id, query)

            if await redis_client.exists(cache_key):
                await redis_client.expire(cache_key, new_ttl)
                return True

            return False

        except Exception as e:
            logger.error(f"Failed to update cache TTL: {e}")
            return False

    async def get_popular_queries(self, widget_id: str, limit: int = 10) -> List[Dict]:
        """Get most popular cached queries for a widget"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return []

            pattern = self._generate_widget_pattern(widget_id)
            queries = []

            async for key in redis_client.scan_iter(match=pattern, count=100):
                cached_data = await redis_client.get(key)
                if cached_data:
                    try:
                        data = json.loads(cached_data)
                        queries.append(
                            {
                                "query": data.get("query", ""),
                                "cached_at": data.get("cached_at", ""),
                                "response_length": len(data.get("response", "")),
                            }
                        )
                    except json.JSONDecodeError:
                        continue

            # Sort by cache time (most recent first) and limit
            queries.sort(key=lambda x: x["cached_at"], reverse=True)
            return queries[:limit]

        except Exception as e:
            logger.error(f"Failed to get popular queries: {e}")
            return []

    async def health_check(self) -> bool:
        """Check if cache service is healthy"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return False

            # Simple ping test
            await redis_client.ping()
            return True

        except Exception as e:
            logger.error(f"Cache health check failed: {e}")
            return False

    async def close(self):
        """Close Redis connections"""
        if self.redis_client:
            await self.redis_client.close()
            logger.info("Cache service connections closed")


# Global instance
cache_service = CacheService()

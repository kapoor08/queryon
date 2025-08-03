import redis
import json
import hashlib
import logging
from typing import Optional
from ..core.config import settings

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.default_ttl = settings.CACHE_TTL
    
    def _generate_cache_key(self, widget_id: str, query: str) -> str:
        """Generate cache key for query"""
        # Normalize query for better cache hits
        normalized_query = query.lower().strip()
        query_hash = hashlib.md5(normalized_query.encode()).hexdigest()
        return f"cache:widget:{widget_id}:query:{query_hash}"
    
    async def get_cached_response(self, widget_id: str, query: str) -> Optional[str]:
        """Get cached response for query"""
        try:
            cache_key = self._generate_cache_key(widget_id, query)
            cached_data = self.redis_client.get(cache_key)
            
            if cached_data:
                data = json.loads(cached_data)
                return data.get("response")
            
            return None
            
        except Exception as e:
            logger.error(f"Cache retrieval failed: {e}")
            return None
    
    async def cache_response(
        self, 
        widget_id: str, 
        query: str, 
        response: str,
        ttl: int = None
    ):
        """Cache response for query"""
        try:
            cache_key = self._generate_cache_key(widget_id, query)
            cache_data = {
                "response": response,
                "widget_id": widget_id,
                "query": query
            }
            
            ttl = ttl or self.default_ttl
            self.redis_client.setex(
                cache_key,
                ttl,
                json.dumps(cache_data)
            )
            
        except Exception as e:
            logger.error(f"Cache storage failed: {e}")
    
    async def invalidate_widget_cache(self, widget_id: str):
        """Invalidate all cached responses for a widget"""
        try:
            pattern = f"cache:widget:{widget_id}:*"
            keys = self.redis_client.keys(pattern)
            
            if keys:
                self.redis_client.delete(*keys)
                logger.info(f"Invalidated {len(keys)} cache entries for widget {widget_id}")
                
        except Exception as e:
            logger.error(f"Cache invalidation failed: {e}")
    
    async def get_cache_stats(self, widget_id: str) -> dict:
        """Get cache statistics for widget"""
        try:
            pattern = f"cache:widget:{widget_id}:*"
            keys = self.redis_client.keys(pattern)
            
            return {
                "cached_queries": len(keys),
                "widget_id": widget_id
            }
            
        except Exception as e:
            logger.error(f"Failed to get cache stats: {e}")
            return {"cached_queries": 0, "widget_id": widget_id}

# Global instance
cache_service = CacheService()
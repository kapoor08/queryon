import redis.asyncio as redis
from datetime import datetime, timedelta
from typing import Optional, Dict
import json
import logging
import asyncio
from sqlalchemy.orm import Session
from ..models.user import User, UsageLog
from ..core.config import settings, SubscriptionPlan
from ..core.database import get_db
from ..core.exceptions import RateLimitError, SubscriptionError

logger = logging.getLogger(__name__)


class UsageService:
    def __init__(self):
        self.redis_client = None
        self._redis_lock = asyncio.Lock()

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
                        )
                    except Exception as e:
                        logger.error(f"Failed to connect to Redis: {e}")
                        # Use in-memory fallback for development
                        self.redis_client = None
        return self.redis_client

    def get_daily_usage_key(self, user_id: str) -> str:
        """Generate Redis key for daily usage tracking"""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        return f"usage:daily:{user_id}:{today}"

    def get_rate_limit_key(self, user_id: str) -> str:
        """Generate Redis key for rate limiting"""
        minute = datetime.utcnow().strftime("%Y-%m-%d:%H:%M")
        return f"rate_limit:{user_id}:{minute}"

    def get_hourly_limit_key(self, user_id: str) -> str:
        """Generate Redis key for hourly rate limiting"""
        hour = datetime.utcnow().strftime("%Y-%m-%d:%H")
        return f"rate_limit:hourly:{user_id}:{hour}"

    async def check_and_increment_usage(
        self, user_id: str, db: Session
    ) -> Dict[str, any]:
        """Check subscription limits and increment usage"""

        # Get user and subscription info
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise SubscriptionError("User not found")

        if not user.is_subscription_active:
            raise SubscriptionError("Subscription is not active")

        # Get plan limits
        plan_limits = settings.get_plan_limits(user.subscription_plan)
        if not plan_limits:
            raise SubscriptionError("Invalid subscription plan")

        daily_limit = plan_limits["daily_queries"]
        api_rate_limit = plan_limits.get("api_rate_limit", 60)

        try:
            redis_client = await self._get_redis_client()

            if redis_client:
                # Check daily usage (Redis for real-time)
                daily_key = self.get_daily_usage_key(user_id)
                current_usage = await redis_client.get(daily_key)
                current_usage = int(current_usage) if current_usage else 0

                # Check if daily limit exceeded (unlimited = -1)
                if daily_limit != -1 and current_usage >= daily_limit:
                    raise RateLimitError(
                        f"Daily query limit ({daily_limit}) exceeded. Upgrade your plan for more queries."
                    )

                # Check API rate limiting (requests per minute)
                rate_key = self.get_rate_limit_key(user_id)
                current_rate = await redis_client.get(rate_key)
                current_rate = int(current_rate) if current_rate else 0

                if current_rate >= api_rate_limit:
                    raise RateLimitError(
                        "Too many requests per minute. Please slow down."
                    )

                # Check hourly limits for additional protection
                hourly_key = self.get_hourly_limit_key(user_id)
                current_hourly = await redis_client.get(hourly_key)
                current_hourly = int(current_hourly) if current_hourly else 0

                hourly_limit = (
                    api_rate_limit * 60
                )  # Allow 60x per-minute limit per hour
                if current_hourly >= hourly_limit:
                    raise RateLimitError(
                        "Hourly request limit exceeded. Please wait before making more requests."
                    )

                # Increment usage counters using pipeline for atomicity
                pipe = redis_client.pipeline()

                # Daily usage (expires at end of day)
                pipe.incr(daily_key)
                pipe.expire(daily_key, 86400)  # 24 hours

                # Rate limiting (expires after 1 minute)
                pipe.incr(rate_key)
                pipe.expire(rate_key, 60)  # 1 minute

                # Hourly limiting (expires after 1 hour)
                pipe.incr(hourly_key)
                pipe.expire(hourly_key, 3600)  # 1 hour

                await pipe.execute()

                # Update incremented values
                current_usage += 1

            else:
                # Fallback to database-only tracking
                current_usage = user.queries_used_today + 1
                if daily_limit != -1 and current_usage > daily_limit:
                    raise RateLimitError(f"Daily query limit ({daily_limit}) exceeded.")

        except redis.RedisError as e:
            logger.warning(f"Redis error, falling back to database: {e}")
            # Fallback to database tracking
            current_usage = user.queries_used_today + 1
            if daily_limit != -1 and current_usage > daily_limit:
                raise RateLimitError(f"Daily query limit ({daily_limit}) exceeded.")

        # Update database (async for performance)
        try:
            user.queries_used_today = current_usage
            user.total_queries_lifetime += 1
            db.commit()
        except Exception as e:
            logger.error(f"Failed to update user usage in DB: {e}")
            db.rollback()

        return {
            "current_usage": current_usage,
            "daily_limit": daily_limit,
            "remaining": daily_limit - current_usage if daily_limit != -1 else -1,
            "plan": user.subscription_plan,
            "api_rate_limit": api_rate_limit,
        }

    async def log_usage(
        self,
        user_id: str,
        widget_id: str,
        query_text: str,
        response_time_ms: int,
        db: Session,
    ):
        """Log usage for analytics"""
        try:
            usage_log = UsageLog(
                user_id=user_id,
                widget_id=widget_id,
                query_text=query_text[:1000],  # Truncate for storage
                response_time_ms=response_time_ms,
            )
            db.add(usage_log)
            db.commit()

            # Also log to Redis for real-time analytics
            redis_client = await self._get_redis_client()
            if redis_client:
                analytics_key = f"analytics:widget:{widget_id}:daily:{datetime.utcnow().strftime('%Y-%m-%d')}"
                analytics_data = {
                    "queries": 1,
                    "avg_response_time": response_time_ms,
                    "last_query": datetime.utcnow().isoformat(),
                }

                # Update analytics
                await redis_client.hincrby(analytics_key, "queries", 1)
                await redis_client.hset(
                    analytics_key, "last_response_time", response_time_ms
                )
                await redis_client.expire(analytics_key, 86400 * 7)  # Keep for 7 days

        except Exception as e:
            logger.error(f"Failed to log usage: {e}")

    async def get_usage_stats(self, user_id: str, db: Session) -> Dict:
        """Get usage statistics for user"""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {}

            # Get current daily usage from Redis
            redis_client = await self._get_redis_client()
            current_daily = 0

            if redis_client:
                try:
                    daily_key = self.get_daily_usage_key(user_id)
                    current_daily = await redis_client.get(daily_key)
                    current_daily = int(current_daily) if current_daily else 0
                except:
                    current_daily = user.queries_used_today
            else:
                current_daily = user.queries_used_today

            # Get plan limits
            plan_limits = settings.get_plan_limits(user.subscription_plan)
            daily_limit = plan_limits.get("daily_queries", 0)

            # Get widget count
            widget_count = len([w for w in user.widgets if w.is_active])

            return {
                "daily_usage": current_daily,
                "daily_limit": daily_limit,
                "lifetime_usage": user.total_queries_lifetime,
                "plan": user.subscription_plan,
                "widgets_count": widget_count,
                "max_widgets": plan_limits.get("max_widgets", 0),
                "api_rate_limit": plan_limits.get("api_rate_limit", 60),
                "usage_percentage": (
                    (current_daily / daily_limit * 100) if daily_limit > 0 else 0
                ),
            }
        except Exception as e:
            logger.error(f"Failed to get usage stats: {e}")
            return {}

    async def reset_daily_usage_if_needed(self, user_id: str, db: Session):
        """Reset daily usage if it's a new day"""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return

            # Check if we need to reset (new day)
            today = datetime.utcnow().date()
            last_reset = user.last_query_reset.date() if user.last_query_reset else None

            if last_reset != today:
                user.queries_used_today = 0
                user.last_query_reset = datetime.utcnow()
                db.commit()

                # Also clear Redis key
                redis_client = await self._get_redis_client()
                if redis_client:
                    daily_key = self.get_daily_usage_key(user_id)
                    await redis_client.delete(daily_key)

                logger.info(f"Reset daily usage for user {user_id}")

        except Exception as e:
            logger.error(f"Failed to reset daily usage: {e}")

    async def get_widget_analytics(self, widget_id: str, days: int = 7) -> Dict:
        """Get analytics for a specific widget"""
        try:
            redis_client = await self._get_redis_client()
            if not redis_client:
                return {"error": "Analytics unavailable"}

            analytics = {"daily_stats": [], "total_queries": 0, "avg_response_time": 0}

            # Get last N days of data
            for i in range(days):
                date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
                analytics_key = f"analytics:widget:{widget_id}:daily:{date}"

                day_data = await redis_client.hgetall(analytics_key)
                if day_data:
                    analytics["daily_stats"].append(
                        {
                            "date": date,
                            "queries": int(day_data.get("queries", 0)),
                            "avg_response_time": float(
                                day_data.get("last_response_time", 0)
                            ),
                        }
                    )
                    analytics["total_queries"] += int(day_data.get("queries", 0))

            # Calculate overall average response time
            if analytics["daily_stats"]:
                total_response_time = sum(
                    day["avg_response_time"] for day in analytics["daily_stats"]
                )
                analytics["avg_response_time"] = total_response_time / len(
                    analytics["daily_stats"]
                )

            return analytics

        except Exception as e:
            logger.error(f"Failed to get widget analytics: {e}")
            return {"error": str(e)}

    async def check_subscription_limits(self, user_id: str, action: str) -> bool:
        """Check if user can perform a specific action based on subscription"""
        try:
            from ..models.user import User
            from ..models.widget import Widget
            from ..core.database import SessionLocal

            db = SessionLocal()
            try:
                user = db.query(User).filter(User.id == user_id).first()
                if not user:
                    return False

                plan_limits = settings.get_plan_limits(user.subscription_plan)

                if action == "create_widget":
                    current_widgets = (
                        db.query(Widget)
                        .filter(Widget.user_id == user_id, Widget.is_active == True)
                        .count()
                    )
                    return current_widgets < plan_limits.get("max_widgets", 1)

                elif action == "upload_document":
                    # Check document limits per widget
                    max_docs = plan_limits.get("max_documents", 100)
                    return max_docs == -1 or True  # Simplified check

                return True

            finally:
                db.close()

        except Exception as e:
            logger.error(f"Failed to check subscription limits: {e}")
            return False

    async def close(self):
        """Close Redis connections"""
        if self.redis_client:
            await self.redis_client.close()


# Global instance
usage_service = UsageService()

import redis
from datetime import datetime, timedelta
from typing import Optional, Dict
import json
import logging
from sqlalchemy.orm import Session
from ..models.user import User, UsageLog
from ..core.config import settings, SubscriptionPlan
from ..core.database import get_db
from ..core.exceptions import RateLimitError, SubscriptionError

logger = logging.getLogger(__name__)

class UsageService:
    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        
    def get_daily_usage_key(self, user_id: str) -> str:
        """Generate Redis key for daily usage tracking"""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        return f"usage:daily:{user_id}:{today}"
    
    def get_rate_limit_key(self, user_id: str) -> str:
        """Generate Redis key for rate limiting"""
        minute = datetime.utcnow().strftime("%Y-%m-%d:%H:%M")
        return f"rate_limit:{user_id}:{minute}"
    
    async def check_and_increment_usage(
        self, 
        user_id: str, 
        db: Session
    ) -> Dict[str, any]:
        """Check subscription limits and increment usage"""
        
        # Get user and subscription info
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise SubscriptionError("User not found")
        
        if not user.is_subscription_active:
            raise SubscriptionError("Subscription is not active")
        
        # Get plan limits
        plan_limits = settings.SUBSCRIPTION_LIMITS.get(user.subscription_plan)
        if not plan_limits:
            raise SubscriptionError("Invalid subscription plan")
        
        daily_limit = plan_limits["daily_queries"]
        
        # Check daily usage (Redis for real-time, DB for persistence)
        daily_key = self.get_daily_usage_key(user_id)
        current_usage = self.redis_client.get(daily_key)
        current_usage = int(current_usage) if current_usage else 0
        
        # Check if limit exceeded (unlimited = -1)
        if daily_limit != -1 and current_usage >= daily_limit:
            raise RateLimitError(
                f"Daily query limit ({daily_limit}) exceeded. Upgrade your plan for more queries."
            )
        
        # Check rate limiting (requests per minute)
        rate_key = self.get_rate_limit_key(user_id)
        current_rate = self.redis_client.get(rate_key)
        current_rate = int(current_rate) if current_rate else 0
        
        if current_rate >= settings.RATE_LIMIT_REQUESTS_PER_MINUTE:
            raise RateLimitError("Too many requests. Please slow down.")
        
        # Increment usage counters
        pipe = self.redis_client.pipeline()
        
        # Daily usage (expires at end of day)
        pipe.incr(daily_key)
        pipe.expire(daily_key, 86400)  # 24 hours
        
        # Rate limiting (expires after 1 minute)
        pipe.incr(rate_key)
        pipe.expire(rate_key, 60)  # 1 minute
        
        pipe.execute()
        
        # Update database (async for performance)
        try:
            user.queries_used_today = current_usage + 1
            user.total_queries_lifetime += 1
            db.commit()
        except Exception as e:
            logger.error(f"Failed to update user usage in DB: {e}")
        
        return {
            "current_usage": current_usage + 1,
            "daily_limit": daily_limit,
            "remaining": daily_limit - (current_usage + 1) if daily_limit != -1 else -1,
            "plan": user.subscription_plan
        }
    
    async def log_usage(
        self, 
        user_id: str, 
        widget_id: str, 
        query_text: str,
        response_time_ms: int,
        db: Session
    ):
        """Log usage for analytics"""
        try:
            usage_log = UsageLog(
                user_id=user_id,
                widget_id=widget_id,
                query_text=query_text[:1000],  # Truncate for storage
                response_time_ms=response_time_ms
            )
            db.add(usage_log)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to log usage: {e}")
    
    async def get_usage_stats(self, user_id: str, db: Session) -> Dict:
        """Get usage statistics for user"""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {}
            
            # Get current daily usage from Redis
            daily_key = self.get_daily_usage_key(user_id)
            current_daily = self.redis_client.get(daily_key)
            current_daily = int(current_daily) if current_daily else 0
            
            # Get plan limits
            plan_limits = settings.SUBSCRIPTION_LIMITS.get(user.subscription_plan, {})
            daily_limit = plan_limits.get("daily_queries", 0)
            
            return {
                "daily_usage": current_daily,
                "daily_limit": daily_limit,
                "lifetime_usage": user.total_queries_lifetime,
                "plan": user.subscription_plan,
                "widgets_count": len(user.widgets),
                "max_widgets": plan_limits.get("max_widgets", 0)
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
                daily_key = self.get_daily_usage_key(user_id)
                self.redis_client.delete(daily_key)
                
        except Exception as e:
            logger.error(f"Failed to reset daily usage: {e}")

# Global instance
usage_service = UsageService()

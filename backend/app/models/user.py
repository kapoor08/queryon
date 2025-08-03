from sqlalchemy import Column, String, Boolean, Enum, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import relationship
from .base import BaseModel
from ..core.config import SubscriptionPlan
import enum

class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE, index=True)
    
    # API Key for widget authentication
    api_key = Column(String(64), unique=True, index=True, nullable=False)
    
    # Subscription
    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.STARTER, index=True)
    subscription_start_date = Column(DateTime(timezone=True))
    subscription_end_date = Column(DateTime(timezone=True))
    is_subscription_active = Column(Boolean, default=True, index=True)
    
    # Usage tracking
    queries_used_today = Column(Integer, default=0, index=True)
    last_query_reset = Column(DateTime(timezone=True), server_default=func.now())
    total_queries_lifetime = Column(Integer, default=0)
    
    # Relationships - use string references to avoid circular imports
    widgets = relationship("Widget", back_populates="user", cascade="all, delete-orphan")
    # conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    # usage_logs = relationship("UsageLog", back_populates="user", cascade="all, delete-orphan")

class UsageLog(BaseModel):
    __tablename__ = "usage_logs"
    
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    widget_id = Column(String(36), nullable=True, index=True)
    query_count = Column(Integer, default=1)
    query_text = Column(String(1000))  # Store for analytics (truncated)
    response_time_ms = Column(Integer)
    date = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User")
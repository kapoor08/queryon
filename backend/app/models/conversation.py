from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    ForeignKey,
    Index,
    Enum,
    JSON,
)
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Conversation(BaseModel):
    __tablename__ = "conversations"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    widget_id = Column(String(36), ForeignKey("widgets.id"), nullable=False, index=True)
    session_id = Column(
        String(100), nullable=False, index=True
    )  # Frontend-generated session ID

    # Analytics
    message_count = Column(Integer, default=0)
    avg_response_time = Column(Float, default=0.0)
    user_satisfaction = Column(Integer)  # 1-5 rating if provided

    # Relationships
    user = relationship("User", back_populates="conversations")
    widget = relationship("Widget", back_populates="conversations")
    messages = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan"
    )


class Message(BaseModel):
    __tablename__ = "messages"

    conversation_id = Column(
        String(36), ForeignKey("conversations.id"), nullable=False, index=True
    )
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)

    # Metadata
    response_time_ms = Column(Integer)
    tokens_used = Column(Integer)
    context_documents = Column(JSON)  # Store which documents were used for context

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


# Add compound indexes for better query performance
Index("idx_conversation_session", Conversation.session_id, Conversation.widget_id)
Index("idx_message_conversation_created", Message.conversation_id, Message.created_at)

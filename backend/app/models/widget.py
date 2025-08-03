from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    JSON,
    Float,
    ForeignKey,
    func,
    Enum,
    DateTime,
)
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum


class TrainingStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class Widget(BaseModel):
    __tablename__ = "widgets"

    # Ownership
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)

    # Pinecone namespace (user_id + widget_id for isolation)
    pinecone_namespace = Column(String(100), unique=True, nullable=False, index=True)

    # Training Status
    training_status = Column(
        Enum(TrainingStatus), default=TrainingStatus.NOT_STARTED, index=True
    )
    total_documents = Column(Integer, default=0)
    total_chunks = Column(Integer, default=0)
    last_training_date = Column(DateTime(timezone=True))

    # AI Configuration
    system_prompt = Column(
        Text,
        default="You are a helpful product assistant. Answer questions based on the provided context.",
    )
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=500)
    search_threshold = Column(Float, default=0.7)

    # Widget Customization
    theme_color = Column(String(7), default="#007bff")
    welcome_message = Column(
        Text, default="Hello! How can I help you with our product?"
    )
    placeholder_text = Column(
        String(200), default="Ask me anything about our product..."
    )
    widget_title = Column(String(100), default="Product Assistant")

    # Analytics
    total_conversations = Column(Integer, default=0)
    total_messages = Column(Integer, default=0)
    avg_response_time = Column(Float, default=0.0)

    # Status
    is_active = Column(Boolean, default=True, index=True)
    is_public = Column(Boolean, default=True)  # Can be embedded publicly

    # Relationships
    user = relationship("User", back_populates="widgets")
    training_documents = relationship(
        "TrainingDocument", back_populates="widget", cascade="all, delete-orphan"
    )
    # conversations = relationship("Conversation", back_populates="widget", cascade="all, delete-orphan")


class TrainingDocument(BaseModel):
    __tablename__ = "training_documents"

    widget_id = Column(String(36), ForeignKey("widgets.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(50), nullable=False)  # text, pdf, docx, url, faq
    source_url = Column(String(500))
    file_size = Column(Integer)
    chunk_count = Column(Integer, default=0)

    # Processing status
    is_processed = Column(Boolean, default=False, index=True)
    processing_error = Column(Text)

    # Changed 'metadata' to 'document_metadata' to avoid reserved keyword
    document_metadata = Column(JSON)  # Store additional document metadata

    # Relationships
    widget = relationship("Widget", back_populates="training_documents")

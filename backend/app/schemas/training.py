from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime


class TrainingDataItem(BaseModel):
    type: str = Field(..., description="Type of data: text, url, file, or faq")
    content: str = Field(..., description="The actual content or URL")
    title: Optional[str] = Field(None, description="Title for the content")
    source_url: Optional[str] = Field(None, description="Source URL if applicable")
    metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict, description="Additional metadata"
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "type": "text",
                    "content": "Our product offers advanced AI capabilities...",
                    "title": "Product Overview",
                },
                {
                    "type": "url",
                    "content": "https://example.com/documentation",
                    "title": "Documentation",
                },
                {
                    "type": "faq",
                    "content": "How do I install the product?",
                    "title": "Installation FAQ",
                    "metadata": {"answer": "Download and run the installer..."},
                },
            ]
        }


class TrainingRequest(BaseModel):
    api_key: str = Field(..., description="User's API key")
    widget_id: str = Field(..., description="Widget ID to train")
    training_data: List[TrainingDataItem] = Field(
        ..., description="List of training data items"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "api_key": "widget_abc123def456",
                "widget_id": "widget_xyz789",
                "training_data": [
                    {
                        "type": "text",
                        "content": "Our product is an AI-powered chatbot that helps customers...",
                        "title": "Product Description",
                    }
                ],
            }
        }


class TrainingResponse(BaseModel):
    task_id: str = Field(..., description="Background task ID")
    status: str = Field(..., description="Training status")
    message: str = Field(..., description="Status message")

    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "task_123456789",
                "status": "started",
                "message": "Training started in background",
            }
        }


class TrainingStatus(BaseModel):
    widget_id: str
    status: str = Field(
        ..., description="Training status: not_started, in_progress, completed, failed"
    )
    total_documents: int = Field(default=0)
    total_chunks: int = Field(default=0)
    last_training_date: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "widget_id": "widget_xyz789",
                "status": "completed",
                "total_documents": 15,
                "total_chunks": 150,
                "last_training_date": "2024-01-15T10:30:00Z",
            }
        }


class DocumentUploadResponse(BaseModel):
    filename: str
    size: int
    status: str
    training_task_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "filename": "product_docs.pdf",
                "size": 1024000,
                "status": "uploaded",
                "training_task_id": "task_123456789",
            }
        }


class DocumentListResponse(BaseModel):
    documents: List[Dict[str, Any]]

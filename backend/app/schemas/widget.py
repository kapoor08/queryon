from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CreateWidgetRequest(BaseModel):
    api_key: str = Field(..., description="User's API key")
    name: str = Field(..., min_length=1, max_length=100, description="Widget name")
    description: Optional[str] = Field(None, max_length=500, description="Widget description")
    system_prompt: Optional[str] = Field(None, description="Custom system prompt")
    welcome_message: Optional[str] = Field("Hello! How can I help you?", description="Welcome message")
    theme_color: Optional[str] = Field("#007bff", description="Theme color (hex)")
    widget_title: Optional[str] = Field("Product Assistant", description="Widget title")
    
    class Config:
        json_schema_extra = {
            "example": {
                "api_key": "widget_abc123def456",
                "name": "My Product Assistant",
                "description": "AI assistant for our e-commerce website",
                "welcome_message": "Hello! How can I help you find the perfect product?",
                "theme_color": "#007bff"
            }
        }

class UpdateWidgetRequest(BaseModel):
    api_key: str = Field(..., description="User's API key")
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    system_prompt: Optional[str] = Field(None)
    welcome_message: Optional[str] = Field(None)
    theme_color: Optional[str] = Field(None)
    widget_title: Optional[str] = Field(None)
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(None, ge=1, le=4000)

class WidgetResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    training_status: str
    is_active: bool
    created_at: datetime
    total_conversations: Optional[int] = 0
    total_messages: Optional[int] = 0
    embed_code: Optional[str] = None
    
    class Config:
        from_attributes = True

class WidgetListResponse(BaseModel):
    widgets: List[WidgetResponse]

class WidgetStatsResponse(BaseModel):
    widget_id: str
    total_conversations: int
    total_messages: int
    total_documents: int
    total_chunks: int
    avg_response_time: float
    vector_count: int
    cached_queries: int
    training_status: str
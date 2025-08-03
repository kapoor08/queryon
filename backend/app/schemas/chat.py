from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import uuid

class ChatRequest(BaseModel):
    api_key: str = Field(..., description="User's API key")
    message: str = Field(..., min_length=1, max_length=1000, description="User's message")
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Session ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "api_key": "widget_abc123def456",
                "message": "What are the key features of your product?",
                "session_id": "session_xyz789"
            }
        }

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI assistant's response")
    session_id: str = Field(..., description="Session ID")
    usage_info: Optional[Dict[str, Any]] = Field(None, description="Usage statistics")
    response_time_ms: Optional[int] = Field(None, description="Response time in milliseconds")
    context_sources: Optional[int] = Field(None, description="Number of context sources used")
    cached: Optional[bool] = Field(False, description="Whether response was cached")
    error: Optional[str] = Field(None, description="Error message if any")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Our product offers advanced AI capabilities, real-time analytics, and seamless integration.",
                "session_id": "session_xyz789",
                "usage_info": {
                    "current_usage": 15,
                    "daily_limit": 50,
                    "remaining": 35,
                    "plan": "starter"
                },
                "response_time_ms": 1250,
                "context_sources": 3,
                "cached": False
            }
        }
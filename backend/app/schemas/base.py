from pydantic import BaseModel
from typing import Optional, Any, Dict

class BaseResponse(BaseModel):
    """Base response model"""
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = 1
    size: int = 10
    
class PaginatedResponse(BaseModel):
    """Paginated response model"""
    items: list
    total: int
    page: int
    size: int
    pages: int
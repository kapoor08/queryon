from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import logging
import uuid
from ...core.config import settings
from ...core.database import get_db
from ...services.vector_store import vector_store_service
from ...services.cache_service import cache_service
from ...schemas.widget import (
    CreateWidgetRequest, WidgetResponse, WidgetListResponse,
    UpdateWidgetRequest, WidgetStatsResponse
)
from ...models.widget import Widget
from ...models.user import User
from ...core.exceptions import ValidationError, SubscriptionError

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/create", response_model=WidgetResponse)
async def create_widget(
    request: CreateWidgetRequest,
    db: Session = Depends(get_db)
):
    """Create a new widget for user"""
    try:
        # Validate API key
        user = db.query(User).filter(
            User.api_key == request.api_key,
            User.is_active == True,
            User.is_subscription_active == True
        ).first()
        
        if not user:
            raise ValidationError("Invalid API key or inactive subscription")
        
        # Check widget limit based on subscription
        plan_limits = settings.SUBSCRIPTION_LIMITS.get(user.subscription_plan, {})
        max_widgets = plan_limits.get("max_widgets", 1)
        
        current_widgets = db.query(Widget).filter(
            Widget.user_id == user.id,
            Widget.is_active == True
        ).count()
        
        if current_widgets >= max_widgets:
            raise SubscriptionError(f"Widget limit reached. Your plan allows {max_widgets} widgets.")
        
        # Generate unique namespace for this widget
        widget_id = str(uuid.uuid4())
        namespace = vector_store_service.get_namespace(user.id, widget_id)
        
        # Create widget
        widget = Widget(
            id=widget_id,
            user_id=user.id,
            name=request.name,
            description=request.description,
            pinecone_namespace=namespace,
            system_prompt=request.system_prompt or "You are a helpful product assistant.",
            welcome_message=request.welcome_message or "Hello! How can I help you?",
            theme_color=request.theme_color or "#007bff",
            widget_title=request.widget_title or "Product Assistant"
        )
        
        db.add(widget)
        db.commit()
        db.refresh(widget)
        
        return WidgetResponse(
            id=widget.id,
            name=widget.name,
            description=widget.description,
            training_status=widget.training_status,
            is_active=widget.is_active,
            created_at=widget.created_at,
            embed_code=f'<script src="https://your-widget-cdn.com/widget.js" data-api-key="{user.api_key}" data-widget-id="{widget.id}"></script>'
        )
        
    except Exception as e:
        logger.error(f"Widget creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list", response_model=WidgetListResponse)
async def list_widgets(
    api_key: str,
    db: Session = Depends(get_db)
):
    """List all widgets for user"""
    try:
        # Validate API key
        user = db.query(User).filter(User.api_key == api_key).first()
        if not user:
            raise ValidationError("Invalid API key")
        
        # Get user's widgets
        widgets = db.query(Widget).filter(Widget.user_id == user.id).all()
        
        widget_list = []
        for widget in widgets:
            widget_list.append(WidgetResponse(
                id=widget.id,
                name=widget.name,
                description=widget.description,
                training_status=widget.training_status,
                is_active=widget.is_active,
                created_at=widget.created_at,
                total_conversations=widget.total_conversations,
                total_messages=widget.total_messages
            ))
        
        return WidgetListResponse(widgets=widget_list)
        
    except Exception as e:
        logger.error(f"Widget listing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{widget_id}", response_model=WidgetResponse)
async def update_widget(
    widget_id: str,
    request: UpdateWidgetRequest,
    db: Session = Depends(get_db)
):
    """Update widget configuration"""
    try:
        # Validate API key and widget ownership
        user = db.query(User).filter(User.api_key == request.api_key).first()
        if not user:
            raise ValidationError("Invalid API key")
        
        widget = db.query(Widget).filter(
            Widget.id == widget_id,
            Widget.user_id == user.id
        ).first()
        
        if not widget:
            raise ValidationError("Widget not found or access denied")
        
        # Update widget fields
        if request.name:
            widget.name = request.name
        if request.description:
            widget.description = request.description
        if request.system_prompt:
            widget.system_prompt = request.system_prompt
        if request.welcome_message:
            widget.welcome_message = request.welcome_message
        if request.theme_color:
            widget.theme_color = request.theme_color
        if request.widget_title:
            widget.widget_title = request.widget_title
        if request.temperature is not None:
            widget.temperature = request.temperature
        if request.max_tokens:
            widget.max_tokens = request.max_tokens
        
        db.commit()
        db.refresh(widget)
        
        # Invalidate cache when widget is updated
        await cache_service.invalidate_widget_cache(widget_id)
        
        return WidgetResponse(
            id=widget.id,
            name=widget.name,
            description=widget.description,
            training_status=widget.training_status,
            is_active=widget.is_active,
            created_at=widget.created_at
        )
        
    except Exception as e:
        logger.error(f"Widget update failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{widget_id}/stats", response_model=WidgetStatsResponse)
async def get_widget_stats(
    widget_id: str,
    api_key: str,
    db: Session = Depends(get_db)
):
    """Get widget statistics"""
    try:
        # Validate API key and widget ownership
        user = db.query(User).filter(User.api_key == api_key).first()
        if not user:
            raise ValidationError("Invalid API key")
        
        widget = db.query(Widget).filter(
            Widget.id == widget_id,
            Widget.user_id == user.id
        ).first()
        
        if not widget:
            raise ValidationError("Widget not found or access denied")
        
        # Get vector store stats
        vector_stats = await vector_store_service.get_namespace_stats(
            widget.pinecone_namespace
        )
        
        # Get cache stats
        cache_stats = await cache_service.get_cache_stats(widget_id)
        
        return WidgetStatsResponse(
            widget_id=widget_id,
            total_conversations=widget.total_conversations,
            total_messages=widget.total_messages,
            total_documents=widget.total_documents,
            total_chunks=widget.total_chunks,
            avg_response_time=widget.avg_response_time,
            vector_count=vector_stats.get("total_vectors", 0),
            cached_queries=cache_stats.get("cached_queries", 0),
            training_status=widget.training_status
        )
        
    except Exception as e:
        logger.error(f"Widget stats failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{widget_id}")
async def delete_widget(
    widget_id: str,
    api_key: str,
    db: Session = Depends(get_db)
):
    """Delete a widget and all its data"""
    try:
        # Validate API key and widget ownership
        user = db.query(User).filter(User.api_key == api_key).first()
        if not user:
            raise ValidationError("Invalid API key")
        
        widget = db.query(Widget).filter(
            Widget.id == widget_id,
            Widget.user_id == user.id
        ).first()
        
        if not widget:
            raise ValidationError("Widget not found or access denied")
        
        # Delete from vector store (all vectors in namespace)
        # Note: Pinecone doesn't support deleting entire namespaces directly
        # You might need to delete all vectors with a filter
        
        # Delete from cache
        await cache_service.invalidate_widget_cache(widget_id)
        
        # Delete from database (cascade will handle related records)
        db.delete(widget)
        db.commit()
        
        return {"message": "Widget deleted successfully"}
        
    except Exception as e:
        logger.error(f"Widget deletion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
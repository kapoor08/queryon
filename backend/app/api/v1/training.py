from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from ...core.config import settings
from ...core.database import get_db
from ...services.training_service import training_service
from ...services.usage_service import usage_service
from ...schemas.training import (
    TrainingRequest, TrainingResponse, TrainingStatus,
    DocumentUploadResponse, DocumentListResponse
)
from ...models.widget import Widget
from ...models.user import User
from ...core.exceptions import ValidationError, SubscriptionError

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/start", response_model=TrainingResponse)
async def start_training(
    request: TrainingRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Start training process for a widget
    
    - **api_key**: User's API key
    - **widget_id**: Widget ID to train
    - **training_data**: List of training data items
    """
    try:
        # Validate API key and get user
        user = db.query(User).filter(
            User.api_key == request.api_key,
            User.is_active == True,
            User.is_subscription_active == True
        ).first()
        
        if not user:
            raise ValidationError("Invalid API key or inactive subscription")
        
        # Validate widget ownership
        widget = db.query(Widget).filter(
            Widget.id == request.widget_id,
            Widget.user_id == user.id
        ).first()
        
        if not widget:
            raise ValidationError("Widget not found or access denied")
        
        # Check subscription limits for documents
        plan_limits = settings.SUBSCRIPTION_LIMITS.get(user.subscription_plan, {})
        max_documents = plan_limits.get("max_documents", 0)
        
        if max_documents != -1 and len(request.training_data) > max_documents:
            raise SubscriptionError(f"Document limit exceeded. Your plan allows {max_documents} documents.")
        
        # Start training
        result = await training_service.start_training(
            widget_id=request.widget_id,
            training_data=request.training_data,
            db=db
        )
        
        return TrainingResponse(**result)
        
    except Exception as e:
        logger.error(f"Training start failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{widget_id}", response_model=TrainingStatus)
async def get_training_status(
    widget_id: str,
    api_key: str,
    db: Session = Depends(get_db)
):
    """Get training status for a widget"""
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
        
        return TrainingStatus(
            widget_id=widget_id,
            status=widget.training_status,
            total_documents=widget.total_documents,
            total_chunks=widget.total_chunks,
            last_training_date=widget.last_training_date
        )
        
    except Exception as e:
        logger.error(f"Failed to get training status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    widget_id: str = None,
    api_key: str = None,
    db: Session = Depends(get_db)
):
    """Upload and process a document for training"""
    try:
        # Validate file type and size
        if file.content_type not in ["text/plain", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
            raise ValidationError("Unsupported file type")
        
        if file.size > settings.MAX_FILE_SIZE:
            raise ValidationError(f"File too large. Maximum size: {settings.MAX_FILE_SIZE / 1024 / 1024}MB")
        
        # Validate API key and widget
        user = db.query(User).filter(User.api_key == api_key).first()
        if not user:
            raise ValidationError("Invalid API key")
        
        widget = db.query(Widget).filter(
            Widget.id == widget_id,
            Widget.user_id == user.id
        ).first()
        
        if not widget:
            raise ValidationError("Widget not found or access denied")
        
        # Save file and process
        file_content = await file.read()
        
        # Process file content based on type
        if file.content_type == "text/plain":
            content = file_content.decode('utf-8')
        else:
            # For PDF/DOCX, you'll need to implement file processing
            content = "File processing not yet implemented for this type"
        
        # Create training data item
        training_data = [{
            "type": "file",
            "content": content,
            "title": file.filename,
            "file_type": file.content_type,
            "metadata": {
                "file_size": file.size,
                "file_name": file.filename
            }
        }]
        
        # Start training with uploaded file
        result = await training_service.start_training(
            widget_id=widget_id,
            training_data=training_data,
            db=db
        )
        
        return DocumentUploadResponse(
            filename=file.filename,
            size=file.size,
            status="uploaded",
            training_task_id=result.get("task_id")
        )
        
    except Exception as e:
        logger.error(f"File upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/document/{document_id}")
async def delete_training_document(
    document_id: str,
    widget_id: str,
    api_key: str,
    db: Session = Depends(get_db)
):
    """Delete a training document"""
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
        
        # Delete document
        success = await training_service.delete_training_document(
            document_id=document_id,
            widget_id=widget_id,
            db=db
        )
        
        if success:
            return {"message": "Document deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")
            
    except Exception as e:
        logger.error(f"Document deletion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
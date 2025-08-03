from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from ..models.widget import Widget

def get_current_user_by_api_key(api_key: str, db: Session = Depends(get_db)) -> User:
    """Get current user by API key"""
    user = db.query(User).filter(
        User.api_key == api_key,
        User.is_active == True,
        User.is_subscription_active == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key or inactive subscription"
        )
    return user

def get_user_widget(user_id: str, widget_id: str, db: Session = Depends(get_db)) -> Widget:
    """Get widget owned by user"""
    widget = db.query(Widget).filter(
        Widget.id == widget_id,
        Widget.user_id == user_id,
        Widget.is_active == True
    ).first()
    
    if not widget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Widget not found or access denied"
        )
    return widget
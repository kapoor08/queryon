from celery import Celery
from sqlalchemy.orm import sessionmaker
from ..core.config import settings
from ..core.database import engine
from ..services.training_service import training_service
import logging

logger = logging.getLogger(__name__)

# Celery app
celery_app = Celery(
    "chatbot_training",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Database session for tasks
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@celery_app.task(bind=True, max_retries=3)
def process_training_data_task(self, widget_id: str, training_data: list):
    """Process training data in background"""
    try:
        db = SessionLocal()
        
        # Use asyncio.run for async function
        import asyncio
        result = asyncio.run(
            training_service.process_training_data_sync(
                widget_id=widget_id,
                training_data=training_data,
                db=db
            )
        )
        
        db.close()
        return {"success": result, "widget_id": widget_id}
        
    except Exception as e:
        logger.error(f"Training task failed for widget {widget_id}: {e}")
        
        # Retry on failure
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60, exc=e)
        
        return {"success": False, "error": str(e), "widget_id": widget_id}


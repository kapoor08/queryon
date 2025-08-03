from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import time
import logging
import uuid

# Import only essential components
from .core.config import settings
from .core.database import get_db

# Configure logging first
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

# Try to import chat router (with fallback)
try:
    from .api.v1 import chat

    chat_available = True
    logger.info("Chat module imported successfully")
except ImportError as e:
    logger.warning(f"Chat module not available: {e}")
    chat_available = False

# Try to import models for training endpoint
try:
    from .models.user import User
    from .models.widget import Widget, TrainingDocument

    models_available = True
    logger.info("Models imported successfully")
except ImportError as e:
    logger.warning(f"Models not available: {e}")
    models_available = False

# Try to import services
try:
    from .services.usage_service import usage_service
    from .services.cache_service import cache_service

    services_available = True
except ImportError as e:
    logger.warning(f"Services not available: {e}")
    services_available = False

# Initialize FastAPI app
app = FastAPI(
    title="Chat Widget RAG Backend",
    description="Production-ready RAG backend for multi-tenant chat widget SaaS",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response
    except Exception as e:
        logger.error(f"Request failed: {e}")
        raise


# Health check - FIXED
@app.get("/health")
async def health_check():
    # Check database connection
    db_healthy = True
    try:
        from sqlalchemy import text  # Import text for raw SQL

        db = next(get_db())
        db.execute(text("SELECT 1"))  # FIXED: Added text() wrapper
        db.close()
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_healthy = False

    # Check external services
    ollama_healthy = False
    if chat_available:
        try:
            from .api.v1.chat import check_ollama_health

            # FIXED: Await the async function
            ollama_healthy = await check_ollama_health()
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            ollama_healthy = False

    return {
        "status": "healthy" if db_healthy else "degraded",
        "environment": str(settings.ENVIRONMENT),
        "version": "1.0.0",
        "features": {
            "chat_available": chat_available,
            "models_available": models_available,
            "services_available": services_available,
            "database_healthy": db_healthy,
            "ollama_healthy": ollama_healthy,
            "database_configured": bool(settings.DATABASE_URL),
            "pinecone_configured": bool(settings.PINECONE_API_KEY),
        },
    }


# Basic info endpoint
@app.get("/")
async def root():
    return {
        "message": "Chat Widget RAG Backend",
        "version": "1.0.0",
        "docs": "/docs" if settings.DEBUG else "Docs disabled in production",
        "endpoints": {
            "health": "/health",
            "chat": "/api/v1/chat/chat" if chat_available else "Not available",
            "training": "/api/v1/training/add" if models_available else "Not available",
        },
    }


# Test endpoint
@app.get("/test")
async def test_endpoint():
    return {
        "message": "Server is running!",
        "config_loaded": True,
        "database_url": "Connected" if settings.DATABASE_URL else "Not configured",
        "pinecone_configured": bool(settings.PINECONE_API_KEY),
        "available_features": {
            "chat": chat_available,
            "models": models_available,
            "services": services_available,
        },
    }


# Training endpoint (if models are available)
if models_available:

    @app.post("/api/v1/training/add")
    async def add_training_data(
        api_key: str, title: str, content: str, db: Session = Depends(get_db)
    ):
        """Add new training data to your widget"""
        try:
            # Get user
            user = db.query(User).filter(User.api_key == api_key).first()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid API key")

            # Check usage limits if service available
            if services_available:
                try:
                    await usage_service.check_and_increment_usage(user.id, db)
                except Exception as e:
                    logger.warning(f"Usage check failed: {e}")

            # Get widget
            widget = (
                db.query(Widget)
                .filter(Widget.user_id == user.id, Widget.is_active == True)
                .first()
            )

            if not widget:
                raise HTTPException(status_code=404, detail="No widget found")

            # Create new training document
            new_doc = TrainingDocument(
                id=str(uuid.uuid4()),
                widget_id=widget.id,
                title=title,
                content=content,
                content_type="text",
                is_processed=True,
                chunk_count=1,
            )

            db.add(new_doc)
            db.commit()

            return {
                "status": "success",
                "message": f"Added training document: {title}",
                "document_id": new_doc.id,
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Training endpoint error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/api/v1/training/list")
    async def list_training_data(api_key: str, db: Session = Depends(get_db)):
        """List all training documents for user's widget"""
        try:
            # Get user
            user = db.query(User).filter(User.api_key == api_key).first()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid API key")

            # Get widget
            widget = (
                db.query(Widget)
                .filter(Widget.user_id == user.id, Widget.is_active == True)
                .first()
            )

            if not widget:
                return {"documents": [], "message": "No widget found"}

            # Get training documents
            docs = (
                db.query(TrainingDocument)
                .filter(TrainingDocument.widget_id == widget.id)
                .all()
            )

            return {
                "documents": [
                    {
                        "id": doc.id,
                        "title": doc.title,
                        "content": (
                            doc.content[:200] + "..."
                            if len(doc.content) > 200
                            else doc.content
                        ),
                        "content_type": doc.content_type,
                        "is_processed": doc.is_processed,
                        "created_at": (
                            doc.created_at.isoformat() if doc.created_at else None
                        ),
                    }
                    for doc in docs
                ],
                "total_documents": len(docs),
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"List training data error: {e}")
            raise HTTPException(status_code=500, detail=str(e))


# Analytics endpoint
if models_available:

    @app.get("/api/v1/analytics")
    async def get_analytics(api_key: str, db: Session = Depends(get_db)):
        """Get usage analytics for user"""
        try:
            # Get user
            user = db.query(User).filter(User.api_key == api_key).first()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid API key")

            # Get widget count
            widget_count = (
                db.query(Widget)
                .filter(Widget.user_id == user.id, Widget.is_active == True)
                .count()
            )

            # Get total training documents
            total_docs = 0
            if widget_count > 0:
                widgets = (
                    db.query(Widget)
                    .filter(Widget.user_id == user.id, Widget.is_active == True)
                    .all()
                )

                for widget in widgets:
                    doc_count = (
                        db.query(TrainingDocument)
                        .filter(TrainingDocument.widget_id == widget.id)
                        .count()
                    )
                    total_docs += doc_count

            # Get usage stats if service available
            usage_stats = {}
            if services_available:
                try:
                    usage_stats = await usage_service.get_usage_stats(user.id, db)
                except Exception as e:
                    logger.warning(f"Usage stats failed: {e}")

            return {
                "user_info": {
                    "email": user.email,
                    "subscription_plan": str(user.subscription_plan),
                    "is_active": user.is_active,
                },
                "usage_stats": {
                    "queries_today": usage_stats.get(
                        "daily_usage", user.queries_used_today
                    ),
                    "total_lifetime_queries": user.total_queries_lifetime,
                    "widgets_count": widget_count,
                    "total_training_documents": total_docs,
                    **usage_stats,
                },
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Analytics error: {e}")
            raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/model/status")
async def model_status():
    """Check if embedding model is loaded"""
    try:
        if chat_available:
            from .api.v1.chat import embedding_model

            return {
                "embedding_model_loaded": embedding_model is not None,
                "model_name": "all-MiniLM-L6-v2" if embedding_model else None,
                "status": "ready" if embedding_model else "not_loaded",
            }
        else:
            return {"embedding_model_loaded": False, "status": "chat_unavailable"}
    except Exception as e:
        logger.error(f"Model status check failed: {e}")
        return {"embedding_model_loaded": False, "status": "error", "error": str(e)}


# Include chat router if available
if chat_available:
    app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
    logger.info("Chat endpoints loaded successfully")


# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Chat Widget RAG Backend")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Chat available: {chat_available}")
    logger.info(f"Models available: {models_available}")
    logger.info(f"Services available: {services_available}")

    # Preload embedding model asynchronously
    if chat_available:

        async def preload_model():
            try:
                logger.info("Preloading embedding model...")
                from .api.v1.chat import get_embedding_model

                # Run in thread pool to avoid blocking startup
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(None, get_embedding_model)
                logger.info("✅ Embedding model loaded successfully!")
            except Exception as e:
                logger.warning(f"Failed to preload embedding model: {e}")

        # Start preloading as background task
        import asyncio

        asyncio.create_task(preload_model())


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Chat Widget RAG Backend")

    # Cleanup resources
    if services_available:
        try:
            # Close Redis connections
            from .services.cache_service import cache_service

            if hasattr(cache_service, "redis_client"):
                await cache_service.close()
        except Exception as e:
            logger.error(f"Cleanup error: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )

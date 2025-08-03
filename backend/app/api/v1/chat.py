from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import logging
import asyncio
from typing import Optional
from ...core.database import get_db
from ...schemas.chat import ChatRequest, ChatResponse
from ...models.user import User
from ...models.widget import Widget, TrainingDocument
from ...services.vector_store import vector_store_service
from ...services.llm_service import llm_service
from ...services.usage_service import usage_service
from ...services.cache_service import cache_service
from ...core.exceptions import ValidationError, RateLimitError

logger = logging.getLogger(__name__)
router = APIRouter()

# Global embedding model (managed by vector store service)
embedding_model = None


def get_embedding_model():
    """Get or load the embedding model (delegated to vector store service)"""
    global embedding_model
    if embedding_model is None:
        try:
            embedding_model = vector_store_service.get_embedding_model()
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            embedding_model = False  # Mark as failed
    return embedding_model if embedding_model else None


async def check_ollama_health() -> bool:
    """Quick health check for Ollama"""
    return await llm_service.health_check()


async def validate_user_and_widget(api_key: str, db: Session) -> tuple:
    """Validate API key and return user and widget"""
    # Get user by API key
    user = (
        db.query(User)
        .filter(
            User.api_key == api_key,
            User.is_active == True,
            User.is_subscription_active == True,
        )
        .first()
    )

    if not user:
        raise ValidationError("Invalid API key or inactive subscription")

    # Check usage limits
    try:
        usage_info = await usage_service.check_and_increment_usage(user.id, db)
    except RateLimitError as e:
        raise HTTPException(status_code=429, detail=str(e))

    # Get user's first active widget
    widget = (
        db.query(Widget)
        .filter(Widget.user_id == user.id, Widget.is_active == True)
        .first()
    )

    if not widget:
        raise ValidationError("No active widget found for this API key")

    return user, widget, usage_info


async def get_relevant_documents(widget_id: str, query: str, db: Session) -> list:
    """Get relevant training documents using vector search"""
    try:
        # Get training documents for this widget
        training_docs = (
            db.query(TrainingDocument)
            .filter(
                TrainingDocument.widget_id == widget_id,
                TrainingDocument.is_processed == True,
            )
            .all()
        )

        if not training_docs:
            return []

        # Try vector search first
        try:
            # Get user_id for namespace
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                return []

            namespace = vector_store_service.get_namespace(widget.user_id, widget_id)

            # Search using vector store
            vector_results = await vector_store_service.search_similar_async(
                namespace=namespace, query=query, k=4, score_threshold=0.7
            )

            if vector_results:
                logger.info(f"Vector search found {len(vector_results)} results")
                return vector_results

        except Exception as e:
            logger.warning(f"Vector search failed, falling back to keyword search: {e}")

        # Fallback to simple keyword search
        return await keyword_search(query, training_docs)

    except Exception as e:
        logger.error(f"Document retrieval failed: {e}")
        return []


async def keyword_search(query: str, documents: list) -> list:
    """Fallback keyword-based search"""
    try:
        query_words = query.lower().split()
        results = []

        for doc in documents:
            content_lower = doc.content.lower()
            score = 0

            for word in query_words:
                if word in content_lower:
                    score += content_lower.count(word)

            if score > 0:
                # Return in vector search format: (content, score, metadata)
                metadata = {
                    "title": doc.title,
                    "content_type": doc.content_type,
                    "document_id": doc.id,
                }
                results.append((doc.content, score / 10.0, metadata))  # Normalize score

        # Sort by score (descending) and return top 3
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:3]

    except Exception as e:
        logger.error(f"Keyword search failed: {e}")
        return []


def generate_template_response(query: str, context_docs: list) -> str:
    """Generate template response when LLM is unavailable"""
    if not context_docs:
        return "I don't have enough information to answer that question. Could you please provide more details or try asking about our product features, pricing, or general information?"

    # Get first document
    content, score, metadata = context_docs[0]
    title = metadata.get("title", "our documentation")

    query_lower = query.lower()

    # Template responses based on query type
    if any(
        word in query_lower
        for word in ["price", "cost", "pricing", "plan", "subscription"]
    ):
        if "pricing" in title.lower():
            return f"Here's our pricing information:\n\n{content}\n\nWould you like to know more about any specific plan?"
        else:
            return f"Based on {title}: {content[:300]}...\n\nFor detailed pricing information, please check our pricing documentation."

    elif any(
        word in query_lower
        for word in ["feature", "capability", "what", "how", "function"]
    ):
        if "feature" in title.lower():
            return f"Here are our key features:\n\n{content}\n\nIs there a specific feature you'd like to know more about?"
        else:
            return f"Here's what I found about our capabilities:\n\n{content[:300]}...\n\nWould you like more details about any specific feature?"

    elif any(
        word in query_lower for word in ["product", "overview", "about", "what is"]
    ):
        if "overview" in title.lower():
            return f"About our product:\n\n{content}\n\nWhat specific aspect would you like to explore further?"
        else:
            return f"Here's information about our product:\n\n{content[:300]}...\n\nWhat would you like to know more about?"

    # Default response
    return f"Based on {title}:\n\n{content[:400]}...\n\nDoes this help answer your question? Feel free to ask for more specific information."


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Main chat endpoint with full RAG pipeline
    """
    start_time = asyncio.get_event_loop().time()

    try:
        # 1. Validate user and widget
        user, widget, usage_info = await validate_user_and_widget(request.api_key, db)

        # 2. Check cache first
        cached_response = await cache_service.get_cached_response(
            widget.id, request.message
        )

        if cached_response:
            response_time = int((asyncio.get_event_loop().time() - start_time) * 1000)
            logger.info(f"Cache hit for widget {widget.id}")

            return ChatResponse(
                response=cached_response,
                session_id=request.session_id,
                usage_info=usage_info,
                response_time_ms=response_time,
                context_sources=0,
                cached=True,
            )

        # 3. Check if widget is trained
        if widget.training_status != "completed":
            response = "I'm still learning about this product. Please check back soon or contact support if this persists."

            return ChatResponse(
                response=response,
                session_id=request.session_id,
                usage_info=usage_info,
                response_time_ms=int(
                    (asyncio.get_event_loop().time() - start_time) * 1000
                ),
                context_sources=0,
            )

        # 4. Get relevant documents
        context_docs = await get_relevant_documents(widget.id, request.message, db)

        # 5. Generate response
        response_text = ""
        response_method = "template"
        model_used = None

        # Try LLM first if available and context exists
        ollama_available = await check_ollama_health()

        if ollama_available and context_docs:
            try:
                llm_result = await llm_service.get_response_async(
                    system_prompt=widget.system_prompt,
                    context_docs=context_docs,
                    user_question=request.message,
                    temperature=widget.temperature,
                    max_tokens=widget.max_tokens,
                )

                if not llm_result.get("fallback", False):
                    response_text = llm_result["response"]
                    response_method = "llm"
                    model_used = llm_result.get("model_used")
                else:
                    response_text = llm_result["response"]
                    response_method = "template_fallback"

            except Exception as e:
                logger.warning(f"LLM generation failed: {e}")
                response_text = generate_template_response(
                    request.message, context_docs
                )
                response_method = "template_error"
        else:
            # Use template response
            response_text = generate_template_response(request.message, context_docs)
            response_method = "template" if context_docs else "no_context"

        # 6. Cache the response
        if (
            response_text and len(response_text) > 20
        ):  # Only cache substantial responses
            await cache_service.cache_response(
                widget.id, request.message, response_text
            )

        # 7. Log usage
        try:
            await usage_service.log_usage(
                user.id,
                widget.id,
                request.message,
                int((asyncio.get_event_loop().time() - start_time) * 1000),
                db,
            )
        except Exception as e:
            logger.warning(f"Usage logging failed: {e}")

        response_time = int((asyncio.get_event_loop().time() - start_time) * 1000)

        # 8. Add debug info to usage_info
        debug_info = {
            "response_method": response_method,
            "ollama_available": ollama_available,
            "context_found": len(context_docs) > 0,
            "model_used": model_used,
        }

        if isinstance(usage_info, dict):
            usage_info.update(debug_info)

        return ChatResponse(
            response=response_text,
            session_id=request.session_id,
            usage_info=usage_info,
            response_time_ms=response_time,
            context_sources=len(context_docs),
            cached=False,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        response_time = int((asyncio.get_event_loop().time() - start_time) * 1000)

        return ChatResponse(
            response="I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
            session_id=request.session_id,
            error=str(e) if settings.DEBUG else "Internal error",
            response_time_ms=response_time,
            context_sources=0,
            cached=False,
        )


@router.get("/health")
async def chat_health_check():
    """Health check endpoint for chat service"""
    ollama_healthy = await check_ollama_health()
    vector_healthy = await vector_store_service.health_check()
    embedding_loaded = get_embedding_model() is not None

    return {
        "status": "healthy",
        "service": "chat",
        "components": {
            "ollama": ollama_healthy,
            "vector_store": vector_healthy,
            "embedding_model": embedding_loaded,
        },
    }


@router.get("/models")
async def list_models():
    """List available models"""
    try:
        models = await llm_service.list_available_models()
        return {
            "available_models": models,
            "current_model": llm_service.model,
            "embedding_model": settings.EMBEDDING_MODEL,
        }
    except Exception as e:
        logger.error(f"Failed to list models: {e}")
        return {"error": str(e)}

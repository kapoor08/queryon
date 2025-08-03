import asyncio
import time
import logging
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from ..models.widget import Widget
from ..models.conversation import Conversation, Message, MessageRole
from ..models.user import User
from ..services.vector_store import vector_store_service
from ..services.llm_service import llm_service
from ..services.usage_service import usage_service
from ..services.cache_service import cache_service
from ..core.exceptions import ChatError, ValidationError

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        pass
    
    async def process_chat_message(
        self,
        api_key: str,
        message: str,
        session_id: str,
        db: Session
    ) -> Dict:
        """Process chat message and return response"""
        start_time = time.time()
        
        try:
            # 1. Validate API key and get user/widget
            user, widget = await self._validate_api_key(api_key, db)
            
            # 2. Check usage limits and increment
            usage_info = await usage_service.check_and_increment_usage(user.id, db)
            
            # 3. Validate widget is trained
            if widget.training_status != "completed":
                return {
                    "response": "I'm still learning about this product. Please check back soon!",
                    "session_id": session_id,
                    "usage_info": usage_info
                }
            
            # 4. Check cache for similar questions
            cached_response = await cache_service.get_cached_response(
                widget.id, message
            )
            
            if cached_response:
                logger.info(f"Cache hit for widget {widget.id}")
                response_time = int((time.time() - start_time) * 1000)
                
                # Log usage and return cached response
                await self._log_conversation(
                    user.id, widget.id, session_id, message, 
                    cached_response, response_time, db
                )
                
                return {
                    "response": cached_response,
                    "session_id": session_id,
                    "usage_info": usage_info,
                    "cached": True
                }
            
            # 5. Search for relevant context
            namespace = vector_store_service.get_namespace(user.id, widget.id)
            context_docs = await vector_store_service.search_similar_async(
                namespace=namespace,
                query=message,
                k=4
            )
            
            # 6. Generate response using LLM
            llm_result = await llm_service.get_response_async(
                system_prompt=widget.system_prompt,
                context_docs=context_docs,
                user_question=message,
                temperature=widget.temperature,
                max_tokens=widget.max_tokens
            )
            
            response = llm_result["response"]
            response_time = llm_result["response_time_ms"]
            
            # 7. Cache the response for future use
            await cache_service.cache_response(widget.id, message, response)
            
            # 8. Log conversation
            await self._log_conversation(
                user.id, widget.id, session_id, message, 
                response, response_time, db, llm_result
            )
            
            # 9. Log usage for analytics
            await usage_service.log_usage(
                user.id, widget.id, message, response_time, db
            )
            
            return {
                "response": response,
                "session_id": session_id,
                "usage_info": usage_info,
                "response_time_ms": response_time,
                "context_sources": len(context_docs)
            }
            
        except Exception as e:
            logger.error(f"Chat processing failed: {e}")
            response_time = int((time.time() - start_time) * 1000)
            
            return {
                "response": "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
                "session_id": session_id,
                "error": str(e),
                "response_time_ms": response_time
            }
    
    async def _validate_api_key(self, api_key: str, db: Session) -> tuple:
        """Validate API key and return user and widget"""
        user = db.query(User).filter(
            User.api_key == api_key,
            User.is_active == True,
            User.is_subscription_active == True
        ).first()
        
        if not user:
            raise ValidationError("Invalid API key or inactive subscription")
        
        # For now, get the first active widget (extend for multiple widgets)
        widget = db.query(Widget).filter(
            Widget.user_id == user.id,
            Widget.is_active == True
        ).first()
        
        if not widget:
            raise ValidationError("No active widget found for this API key")
        
        return user, widget
    
    async def _log_conversation(
        self,
        user_id: str,
        widget_id: str,
        session_id: str,
        user_message: str,
        assistant_response: str,
        response_time_ms: int,
        db: Session,
        llm_result: Dict = None
    ):
        """Log conversation to database"""
        try:
            # Get or create conversation
            conversation = db.query(Conversation).filter(
                Conversation.session_id == session_id,
                Conversation.widget_id == widget_id
            ).first()
            
            if not conversation:
                conversation = Conversation(
                    user_id=user_id,
                    widget_id=widget_id,
                    session_id=session_id,
                    message_count=0,
                    avg_response_time=0.0
                )
                db.add(conversation)
                db.flush()  # Get ID
            
            # Add user message
            user_msg = Message(
                conversation_id=conversation.id,
                role=MessageRole.USER,
                content=user_message
            )
            db.add(user_msg)
            
            # Add assistant response
            assistant_msg = Message(
                conversation_id=conversation.id,
                role=MessageRole.ASSISTANT,
                content=assistant_response,
                response_time_ms=response_time_ms,
                tokens_used=llm_result.get("tokens_used", 0) if llm_result else 0,
                context_documents=llm_result.get("context_docs_used", 0) if llm_result else 0
            )
            db.add(assistant_msg)
            
            # Update conversation stats
            conversation.message_count += 2  # User + Assistant
            conversation.avg_response_time = (
                (conversation.avg_response_time + response_time_ms) / 2
            )
            
            db.commit()
            
        except Exception as e:
            logger.error(f"Failed to log conversation: {e}")
            db.rollback()

# Global instance
chat_service = ChatService()
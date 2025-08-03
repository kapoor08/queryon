from langchain.llms import Ollama
from langchain.schema import BaseMessage, HumanMessage, SystemMessage
from langchain.callbacks.manager import CallbackManagerForLLMRun
from typing import List, Optional, Dict, Any
import asyncio
import logging
import time
from ..core.config import settings
from ..core.exceptions import LLMError

logger = logging.getLogger(__name__)

class OllamaLLMService:
    def __init__(self):
        self.llm = Ollama(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL,
            temperature=0.7,
            timeout=settings.OLLAMA_TIMEOUT
        )
        
    def create_context_prompt(
        self, 
        system_prompt: str,
        context_docs: List[tuple],
        user_question: str,
        max_context_length: int = None
    ) -> str:
        """Create a well-structured prompt with context"""
        max_length = max_context_length or settings.MAX_CONTEXT_LENGTH
        
        # Build context from retrieved documents
        context_parts = []
        current_length = 0
        
        for content, score, metadata in context_docs:
            # Only include high-quality matches
            if score < settings.VECTOR_SEARCH_TOP_K:  # Lower score = better match
                doc_text = f"Document: {content.strip()}"
                if len(doc_text) + current_length < max_length:
                    context_parts.append(doc_text)
                    current_length += len(doc_text)
                else:
                    break
        
        context = "\n\n".join(context_parts) if context_parts else "No relevant context found."
        
        prompt = f"""{system_prompt}

Context Information:
{context}

User Question: {user_question}

Instructions:
- Answer based primarily on the provided context
- If the context doesn't contain enough information, say so politely
- Be helpful, accurate, and concise
- Maintain a friendly, professional tone

Answer:"""

        return prompt
    
    async def get_response_async(
        self,
        system_prompt: str,
        context_docs: List[tuple],
        user_question: str,
        temperature: float = None,
        max_tokens: int = None
    ) -> Dict[str, Any]:
        """Get LLM response asynchronously"""
        start_time = time.time()
        
        try:
            # Create prompt with context
            prompt = self.create_context_prompt(
                system_prompt=system_prompt,
                context_docs=context_docs,
                user_question=user_question
            )
            
            # Set temperature if provided
            if temperature is not None:
                self.llm.temperature = temperature
            
            # Run LLM in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self._generate_response_sync,
                prompt
            )
            
            response_time = int((time.time() - start_time) * 1000)  # milliseconds
            
            return {
                "response": response.strip(),
                "response_time_ms": response_time,
                "context_docs_used": len(context_docs),
                "tokens_used": self._estimate_tokens(prompt + response)
            }
            
        except Exception as e:
            logger.error(f"LLM response generation failed: {e}")
            response_time = int((time.time() - start_time) * 1000)
            
            return {
                "response": "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
                "response_time_ms": response_time,
                "context_docs_used": 0,
                "tokens_used": 0,
                "error": str(e)
            }
    
    def _generate_response_sync(self, prompt: str) -> str:
        """Generate response synchronously"""
        try:
            response = self.llm.invoke(prompt)
            return response
        except Exception as e:
            logger.error(f"Ollama invocation failed: {e}")
            raise LLMError(f"Failed to generate response: {e}")
    
    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation (1 token ≈ 4 characters for English)"""
        return len(text) // 4
    
    async def health_check(self) -> bool:
        """Check if Ollama service is healthy"""
        try:
            test_response = await self.get_response_async(
                system_prompt="You are a helpful assistant.",
                context_docs=[],
                user_question="Say 'OK' if you're working."
            )
            return "error" not in test_response
        except:
            return False

# Global instance
llm_service = OllamaLLMService()
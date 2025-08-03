import asyncio
import aiohttp
import logging
import time
import json
from typing import List, Optional, Dict, Any
from ..core.config import settings
from ..core.exceptions import LLMError

logger = logging.getLogger(__name__)


class OllamaLLMService:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.timeout = settings.OLLAMA_TIMEOUT
        self.session = None

    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create HTTP session"""
        if self.session is None or self.session.closed:
            timeout = aiohttp.ClientTimeout(total=self.timeout)
            self.session = aiohttp.ClientSession(timeout=timeout)
        return self.session

    async def close_session(self):
        """Close HTTP session"""
        if self.session and not self.session.closed:
            await self.session.close()

    def create_context_prompt(
        self,
        system_prompt: str,
        context_docs: List[tuple],
        user_question: str,
        max_context_length: int = None,
    ) -> str:
        """Create a well-structured prompt with context"""
        max_length = max_context_length or settings.MAX_CONTEXT_LENGTH

        # Build context from retrieved documents
        context_parts = []
        current_length = 0

        for content, score, metadata in context_docs:
            # Only include high-quality matches (higher score = better match in cosine similarity)
            if score >= 0.7:  # Cosine similarity threshold
                doc_text = f"Document: {content.strip()}"
                if len(doc_text) + current_length < max_length:
                    context_parts.append(doc_text)
                    current_length += len(doc_text)
                else:
                    break

        context = (
            "\n\n".join(context_parts)
            if context_parts
            else "No relevant context found."
        )

        # Optimized prompt for qwen:0.5b
        prompt = f"""{system_prompt}

Context Information:
{context}

User Question: {user_question}

Instructions:
- Answer based primarily on the provided context
- Be helpful, accurate, and concise (2-3 sentences max)
- If context doesn't contain enough information, say so politely
- Maintain a friendly, professional tone

Answer:"""

        return prompt

    async def get_response_async(
        self,
        system_prompt: str,
        context_docs: List[tuple],
        user_question: str,
        temperature: float = None,
        max_tokens: int = None,
    ) -> Dict[str, Any]:
        """Get LLM response asynchronously"""
        start_time = time.time()

        try:
            # Create prompt with context
            prompt = self.create_context_prompt(
                system_prompt=system_prompt,
                context_docs=context_docs,
                user_question=user_question,
            )

            # Try multiple models in order of preference
            models_to_try = [
                {
                    "name": "qwen:0.5b",
                    "timeout": 30,
                    "max_tokens": 120,
                },  # Increased from 8s
                {
                    "name": "tinydolphin:latest",
                    "timeout": 45,
                    "max_tokens": 150,
                },  # Increased from 15s
                {
                    "name": "phi:latest",
                    "timeout": 60,
                    "max_tokens": 200,
                },  # Increased from 20s
            ]

            for model_config in models_to_try:
                try:
                    response = await self._generate_response_async(
                        prompt=prompt,
                        model=model_config["name"],
                        temperature=temperature or 0.4,
                        max_tokens=max_tokens or model_config["max_tokens"],
                        timeout=model_config["timeout"],
                    )

                    if response and len(response.strip()) > 10:  # Valid response
                        response_time = int((time.time() - start_time) * 1000)

                        return {
                            "response": response.strip(),
                            "response_time_ms": response_time,
                            "context_docs_used": len(context_docs),
                            "tokens_used": self._estimate_tokens(prompt + response),
                            "model_used": model_config["name"],
                        }

                except Exception as e:
                    logger.warning(f"Model {model_config['name']} failed: {e}")
                    continue

            # If all models fail, raise exception
            raise LLMError("All available models failed to generate response")

        except Exception as e:
            logger.error(f"LLM response generation failed: {e}")
            response_time = int((time.time() - start_time) * 1000)

            # Return fallback response
            return {
                "response": self._get_fallback_response(context_docs, user_question),
                "response_time_ms": response_time,
                "context_docs_used": len(context_docs),
                "tokens_used": 0,
                "error": str(e),
                "fallback": True,
            }

    async def _generate_response_async(
        self,
        prompt: str,
        model: str = None,
        temperature: float = 0.4,
        max_tokens: int = 120,
        timeout: int = 10,
    ) -> str:
        """Generate response using Ollama API asynchronously"""
        session = await self._get_session()
        model = model or self.model

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "top_p": 0.9,
                "repeat_penalty": 1.1,
                "stop": ["\n\n", "User:", "Question:"],
            },
        }

        try:
            async with session.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=timeout),
            ) as response:

                if response.status == 200:
                    result = await response.json()
                    generated_text = result.get("response", "").strip()

                    if generated_text:
                        return generated_text
                    else:
                        raise LLMError("Empty response from model")
                else:
                    error_text = await response.text()
                    raise LLMError(f"HTTP {response.status}: {error_text}")

        except asyncio.TimeoutError:
            raise LLMError(f"Model {model} timed out after {timeout}s")
        except aiohttp.ClientError as e:
            raise LLMError(f"HTTP client error: {e}")
        except Exception as e:
            raise LLMError(f"Unexpected error: {e}")

    def _get_fallback_response(
        self, context_docs: List[tuple], user_question: str
    ) -> str:
        """Generate fallback response when LLM fails"""
        if not context_docs:
            return "I don't have enough information to answer that question. Could you please provide more details or try asking about our product features, pricing, or general information?"

        # Use first context document for fallback
        content, score, metadata = context_docs[0]
        title = metadata.get("title", "our documentation")

        query_lower = user_question.lower()

        if any(word in query_lower for word in ["price", "cost", "pricing", "plan"]):
            return f"Based on {title}: {content[:200]}... For detailed pricing information, please check our pricing page."
        elif any(
            word in query_lower for word in ["feature", "capability", "what", "how"]
        ):
            return f"Here's what I found in {title}: {content[:200]}... Would you like more specific information about any feature?"
        else:
            return f"According to {title}: {content[:200]}... Does this help answer your question?"

    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation (1 token ≈ 4 characters for English)"""
        return len(text) // 4

    async def health_check(self) -> bool:
        """Check if Ollama service is healthy"""
        try:
            session = await self._get_session()

            async with session.get(
                f"{self.base_url}/api/tags", timeout=aiohttp.ClientTimeout(total=5)
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    models = data.get("models", [])

                    # Check if our model is available
                    available_models = [model.get("name", "") for model in models]
                    return any(
                        self.model in model_name for model_name in available_models
                    )

                return False

        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return False

    async def list_available_models(self) -> List[str]:
        """List available models in Ollama"""
        try:
            session = await self._get_session()

            async with session.get(f"{self.base_url}/api/tags") as response:
                if response.status == 200:
                    data = await response.json()
                    models = data.get("models", [])
                    return [model.get("name", "") for model in models]

                return []

        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []

    async def pull_model(self, model_name: str) -> bool:
        """Pull a model if not available"""
        try:
            session = await self._get_session()

            payload = {"name": model_name}

            async with session.post(
                f"{self.base_url}/api/pull",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=300),  # 5 minutes for model pull
            ) as response:

                return response.status == 200

        except Exception as e:
            logger.error(f"Failed to pull model {model_name}: {e}")
            return False


# Global instance
llm_service = OllamaLLMService()

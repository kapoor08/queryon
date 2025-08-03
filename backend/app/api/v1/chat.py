from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import logging
from ...core.database import get_db
from ...schemas.chat import ChatRequest, ChatResponse
from ...models.user import User
from ...models.widget import Widget, TrainingDocument

# Vector search imports
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import requests
import json

logger = logging.getLogger(__name__)
router = APIRouter()

# Global model (load once)
embedding_model = None

def get_embedding_model():
    """Get or load the embedding model"""
    global embedding_model
    if embedding_model is None:
        print("Loading embedding model...")
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return embedding_model

def vector_search(query: str, documents: list, top_k: int = 3) -> list:
    """Enhanced vector-based search"""
    if not documents:
        return []
    
    try:
        model = get_embedding_model()
        
        # Get embeddings
        query_embedding = model.encode([query])
        doc_texts = [doc.content for doc in documents]
        doc_embeddings = model.encode(doc_texts)
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, doc_embeddings)[0]
        
        # Get top results
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Similarity threshold
                results.append((documents[idx], similarities[idx]))
        
        return [doc for doc, score in results]
        
    except Exception as e:
        print(f"Vector search failed, falling back to keyword search: {e}")
        return simple_search(query, documents)

def simple_search(query: str, documents: list) -> list:
    """Simple keyword-based search in documents"""
    query_words = query.lower().split()
    results = []
    
    for doc in documents:
        content_lower = doc.content.lower()
        score = 0
        for word in query_words:
            if word in content_lower:
                score += content_lower.count(word)
        
        if score > 0:
            results.append((doc, score))
    
    # Sort by score (descending)
    results.sort(key=lambda x: x[1], reverse=True)
    return [doc for doc, score in results[:3]]  # Return top 3

def generate_response(query: str, context_docs: list) -> str:
    """Generate a simple response based on context"""
    if not context_docs:
        return "I don't have enough information to answer that question. Could you please provide more details or try asking about our product features, pricing, or general information?"
    
    # Combine context from relevant documents
    context = "\n\n".join([f"From {doc.title}: {doc.content}" for doc in context_docs])
    
    # Simple response generation (in real implementation, this would use an LLM)
    query_lower = query.lower()
    
    if any(word in query_lower for word in ["price", "cost", "pricing", "plan", "subscription"]):
        pricing_doc = next((doc for doc in context_docs if "pricing" in doc.title.lower()), None)
        if pricing_doc:
            return f"Here's our pricing information:\n\n{pricing_doc.content}\n\nWould you like to know more about any specific plan?"
    
    elif any(word in query_lower for word in ["feature", "capability", "what", "how", "function"]):
        features_doc = next((doc for doc in context_docs if "feature" in doc.title.lower()), None)
        if features_doc:
            return f"Here are our key features:\n\n{features_doc.content}\n\nIs there a specific feature you'd like to know more about?"
    
    elif any(word in query_lower for word in ["product", "overview", "about", "what is"]):
        overview_doc = next((doc for doc in context_docs if "overview" in doc.title.lower()), None)
        if overview_doc:
            return f"About our product:\n\n{overview_doc.content}\n\nWhat specific aspect would you like to explore further?"
    
    # Default response with context
    return f"Based on our documentation:\n\n{context_docs[0].content}\n\nDoes this help answer your question?"

def generate_llm_response(query: str, context_docs: list, widget_name: str = "Product Assistant") -> str:
    """Generate response using Ollama LLM - OPTIMIZED FOR QWEN:0.5B"""
    try:
        # Build shorter context (qwen works well with concise info)
        if len(context_docs) > 2:
            context_docs = context_docs[:2]  # Use only top 2 most relevant docs
        
        context = "\n".join([f"{doc.title}: {doc.content[:250]}..." for doc in context_docs])  # Shorter context for speed
        
        # Optimized prompt for qwen (works better with direct instructions)
        prompt = f"""You are {widget_name}. Answer the user's question using this information:

{context}

User: {query}

Provide a helpful, concise answer (2-3 sentences):"""

        # Use qwen:0.5b first (ultra-fast), then fallback to other models
        models_to_try = ['qwen:0.5b', 'tinydolphin:latest', 'phi:latest']
        
        for model_name in models_to_try:
            try:
                print(f"Trying model: {model_name}")
                
                # Call Ollama API with qwen-optimized settings
                response = requests.post(
                    'http://localhost:11434/api/generate',
                    json={
                        'model': model_name,
                        'prompt': prompt,
                        'stream': False,
                        'options': {
                            'temperature': 0.4 if model_name == 'qwen:0.5b' else 0.3,
                            'num_predict': 120 if model_name == 'qwen:0.5b' else 150,
                            'top_p': 0.9,
                            'repeat_penalty': 1.1
                        }
                    },
                    timeout=5 if model_name == 'qwen:0.5b' else 10  # Very fast timeout for qwen
                )
                
                print(f"Response status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    generated_text = result.get('response', '').strip()
                    if generated_text:
                        print(f"✅ Successfully generated response with {model_name}")
                        return generated_text
                else:
                    print(f"❌ Model {model_name} failed with status {response.status_code}")
                    continue
                    
            except Exception as model_error:
                print(f"❌ Model {model_name} failed: {model_error}")
                continue
        
        # If all models fail, raise an exception
        raise Exception("All Ollama models failed")
            
    except Exception as e:
        print(f"LLM generation failed: {e}")
        # Fallback to simple response generation
        return generate_response(query, context_docs)

def check_ollama_health() -> bool:
    """Quick health check with timeout"""
    try:
        response = requests.get('http://localhost:11434/api/tags', timeout=2)  # Very quick check
        return response.status_code == 200
    except:
        return False

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    RAG Chat endpoint - now with LLM integration!
    """
    try:
        # Get user by API key
        user = db.query(User).filter(User.api_key == request.api_key).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid API key")
        
        # Get user's first widget (for testing)
        widget = db.query(Widget).filter(
            Widget.user_id == user.id,
            Widget.is_active == True
        ).first()
        
        if not widget:
            return ChatResponse(
                response="No trained widget found. Please set up and train a widget first.",
                session_id=request.session_id
            )
        
        # Get training documents for this widget
        training_docs = db.query(TrainingDocument).filter(
            TrainingDocument.widget_id == widget.id,
            TrainingDocument.is_processed == True
        ).all()
        
        if not training_docs:
            return ChatResponse(
                response="This widget hasn't been trained yet. Please add some training documents first.",
                session_id=request.session_id
            )
        
        # Search for relevant documents using vector search (with fallback)
        try:
            relevant_docs = vector_search(request.message, training_docs)
            search_method = "vector"
        except Exception as e:
            logger.warning(f"Vector search failed, using simple search: {e}")
            relevant_docs = simple_search(request.message, training_docs)
            search_method = "keyword"
        
        # Generate response using LLM (with proper error handling)
        ollama_available = check_ollama_health()
        
        if ollama_available and relevant_docs:
            try:
                response_text = generate_llm_response(request.message, relevant_docs, widget.name)
                response_method = "llm"
            except Exception as llm_error:
                logger.warning(f"LLM generation failed, using template: {llm_error}")
                response_text = generate_response(request.message, relevant_docs)
                response_method = "template_fallback"
        else:
            response_text = generate_response(request.message, relevant_docs)
            response_method = "template" if relevant_docs else "no_context"
        
        return ChatResponse(
            response=response_text,
            session_id=request.session_id,
            usage_info={
                "current_usage": user.queries_used_today + 1,
                "daily_limit": 500,  # Pro plan
                "remaining": 499 - user.queries_used_today,
                "plan": user.subscription_plan,
                "search_method": search_method,
                "response_method": response_method,
                "ollama_available": ollama_available
            },
            response_time_ms=150,
            context_sources=len(relevant_docs),
            cached=False
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return ChatResponse(
            response="I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
            session_id=request.session_id,
            error=str(e),
            response_time_ms=161
        )

@router.get("/health")
async def chat_health_check():
    """Health check endpoint for chat service"""
    return {"status": "healthy", "service": "chat"}
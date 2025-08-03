from pydantic_settings import BaseSettings
from typing import Optional, List, Dict
import secrets
from enum import Enum

class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class SubscriptionPlan(str, Enum):
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = False
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg://user:password@localhost/chatbot_saas"
    ASYNC_DATABASE_URL: str = "postgresql+psycopg://user:password@localhost/chatbot_saas"
    
    # Redis (Caching & Rate Limiting)
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 300  # 5 minutes default
    
    # Celery (Background Tasks)
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Vector Store (Pinecone)
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str
    PINECONE_INDEX_NAME: str = "chatbot-saas-main"
    PINECONE_DIMENSION: int = 1024
    
    # LLM Settings (Ollama)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"  # Added this line
    OLLAMA_TIMEOUT: int = 30
    
    # Embedding Settings
    EMBEDDING_MODEL: str = "nomic-embed-text"  # Added this line
    EMBEDDING_CHUNK_SIZE: int = 1000
    EMBEDDING_CHUNK_OVERLAP: int = 200
    EMBEDDING_BATCH_SIZE: int = 50
    
    # OpenAI Settings (Optional)
    OPENAI_API_KEY: Optional[str] = None
    
    # Subscription Plans Configuration
    SUBSCRIPTION_LIMITS: Dict = {
        SubscriptionPlan.STARTER: {
            "daily_queries": 50,
            "max_widgets": 1,
            "max_documents": 100,
            "priority_support": False
        },
        SubscriptionPlan.PRO: {
            "daily_queries": 500,
            "max_widgets": 3,
            "max_documents": 1000,
            "priority_support": True
        },
        SubscriptionPlan.ENTERPRISE: {
            "daily_queries": -1,  # Unlimited
            "max_widgets": 10,
            "max_documents": -1,  # Unlimited
            "priority_support": True
        }
    }
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    RATE_LIMIT_BURST_SIZE: int = 10
    
    # Performance
    MAX_CONCURRENT_REQUESTS: int = 100
    REQUEST_TIMEOUT: int = 30
    VECTOR_SEARCH_TOP_K: int = 4
    MAX_CONTEXT_LENGTH: int = 4000
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".txt", ".pdf", ".docx", ".md"]
    
    # Monitoring & Logging
    LOG_LEVEL: str = "INFO"
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
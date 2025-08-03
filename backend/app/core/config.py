from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import Optional, List, Dict, Union
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
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32), min_length=32
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+psycopg://chatbot_user:secure123@localhost:5432/chatbot_saas",
        description="PostgreSQL database URL",
    )
    ASYNC_DATABASE_URL: Optional[str] = None

    # Redis (Caching & Rate Limiting)
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 300  # 5 minutes default

    # Celery (Background Tasks)
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Vector Store (Pinecone) - Made optional for development
    PINECONE_API_KEY: str = Field(
        default="placeholder_key_for_development_that_is_32_chars_long",
        description="Pinecone API key",
    )
    PINECONE_ENVIRONMENT: str = Field(
        default="us-east1-gcp", description="Pinecone environment"
    )
    PINECONE_INDEX_NAME: str = "chatbot-saas-main"
    PINECONE_DIMENSION: int = Field(default=1024, ge=1, le=2048)

    # LLM Settings (Ollama)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen:0.5b"  # You have this model ✅
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"  # You have this model ✅
    OLLAMA_TIMEOUT: int = Field(default=30, ge=5, le=120)

    # Embedding Settings - FIXED
    EMBEDDING_MODEL: str = (
        "sentence-transformers/all-MiniLM-L6-v2"  # This exists in HuggingFace ✅
    )
    EMBEDDING_CHUNK_SIZE: int = Field(default=1000, ge=100, le=4000)
    EMBEDDING_CHUNK_OVERLAP: int = Field(default=200, ge=0, le=1000)
    EMBEDDING_BATCH_SIZE: int = Field(default=50, ge=1, le=100)

    # OpenAI Settings (Optional backup) - FIXED validation
    OPENAI_API_KEY: Optional[str] = Field(
        default=None, description="OpenAI API key (optional)"
    )

    # Subscription Plans Configuration
    SUBSCRIPTION_LIMITS: Dict = {
        SubscriptionPlan.STARTER: {
            "daily_queries": 50,
            "max_widgets": 1,
            "max_documents": 100,
            "max_file_size_mb": 5,
            "priority_support": False,
            "api_rate_limit": 30,  # requests per minute
        },
        SubscriptionPlan.PRO: {
            "daily_queries": 500,
            "max_widgets": 3,
            "max_documents": 1000,
            "max_file_size_mb": 25,
            "priority_support": True,
            "api_rate_limit": 100,
        },
        SubscriptionPlan.ENTERPRISE: {
            "daily_queries": -1,  # Unlimited
            "max_widgets": 10,
            "max_documents": -1,  # Unlimited
            "max_file_size_mb": 100,
            "priority_support": True,
            "api_rate_limit": 300,
        },
    }

    # Rate Limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = Field(default=60, ge=1, le=1000)
    RATE_LIMIT_BURST_SIZE: int = Field(default=10, ge=1, le=50)

    # Performance
    MAX_CONCURRENT_REQUESTS: int = Field(default=100, ge=1, le=1000)
    REQUEST_TIMEOUT: int = Field(default=30, ge=5, le=300)
    VECTOR_SEARCH_TOP_K: int = Field(default=4, ge=1, le=20)
    MAX_CONTEXT_LENGTH: int = Field(default=4000, ge=1000, le=32000)

    # File Upload
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, ge=1024)  # 10MB default
    ALLOWED_FILE_TYPES: List[str] = [".txt", ".pdf", ".docx", ".md", ".csv"]

    # Security
    API_KEY_LENGTH: int = 32
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SECURE: bool = True
    CORS_ALLOW_CREDENTIALS: bool = True

    # Monitoring & Logging
    LOG_LEVEL: str = Field(
        default="INFO", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"
    )
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True
    LOG_SQL_QUERIES: bool = False

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Cache Configuration
    CACHE_RESPONSE_TTL: int = 600  # 10 minutes for responses
    CACHE_MODEL_TTL: int = 3600  # 1 hour for model cache
    CACHE_USER_TTL: int = 300  # 5 minutes for user data

    # Model Configuration
    MODEL_TEMPERATURE: float = Field(default=0.7, ge=0.0, le=2.0)
    MODEL_MAX_TOKENS: int = Field(default=500, ge=1, le=4000)
    MODEL_TOP_P: float = Field(default=0.9, ge=0.0, le=1.0)

    # Field validators (Pydantic v2 style)
    @field_validator("OPENAI_API_KEY", mode="before")
    @classmethod
    def validate_openai_key(cls, v):
        # If empty string or None, return None
        if not v or v.strip() == "":
            return None
        # If provided, must be at least 32 characters
        if len(v) < 32:
            raise ValueError("OpenAI API key must be at least 32 characters long")
        return v

    @field_validator("PINECONE_API_KEY", mode="before")
    @classmethod
    def validate_pinecone_key(cls, v):
        # If empty string, use placeholder
        if not v or v.strip() == "":
            return "placeholder_key_for_development_that_is_32_chars_long"
        return v

    @field_validator("ASYNC_DATABASE_URL")
    @classmethod
    def set_async_database_url(cls, v, info):
        if v is None:
            database_url = info.data.get("DATABASE_URL")
            if database_url:
                # Convert sync URL to async
                return database_url.replace(
                    "postgresql+psycopg://", "postgresql+asyncpg://"
                )
        return v

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    @field_validator("PINECONE_DIMENSION")
    @classmethod
    def validate_dimension(cls, v):
        # Common embedding dimensions
        valid_dimensions = [384, 512, 768, 1024, 1536, 2048]
        if v not in valid_dimensions:
            raise ValueError(f"Dimension must be one of {valid_dimensions}")
        return v

    @field_validator("EMBEDDING_CHUNK_OVERLAP")
    @classmethod
    def validate_chunk_overlap(cls, v, info):
        chunk_size = info.data.get("EMBEDDING_CHUNK_SIZE", 1000)
        if v >= chunk_size:
            raise ValueError("Chunk overlap must be less than chunk size")
        return v

    def get_plan_limits(self, plan: SubscriptionPlan) -> Dict:
        """Get limits for a specific subscription plan"""
        return self.SUBSCRIPTION_LIMITS.get(
            plan, self.SUBSCRIPTION_LIMITS[SubscriptionPlan.STARTER]
        )

    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENVIRONMENT == Environment.PRODUCTION

    def is_development(self) -> bool:
        """Check if running in development"""
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "validate_assignment": True,
        "extra": "ignore",  # Ignore extra fields in .env
    }


# Global settings instance
try:
    settings = Settings()
except Exception as e:
    print(f"⚠️  Configuration error: {e}")
    print("Creating settings with defaults for development...")
    # Create with minimal defaults for development
    import os

    os.environ.setdefault(
        "DATABASE_URL",
        "postgresql+psycopg://chatbot_user:secure123@localhost:5432/chatbot_saas",
    )
    os.environ.setdefault(
        "PINECONE_API_KEY", "placeholder_key_for_development_that_is_32_chars_long"
    )
    os.environ.setdefault("PINECONE_ENVIRONMENT", "us-east1-gcp")
    settings = Settings()

# Environment-specific configurations
if settings.is_production():
    # Production overrides
    settings.DEBUG = False
    settings.LOG_SQL_QUERIES = False
    settings.BACKEND_CORS_ORIGINS = [
        "https://yourdomain.com",
        "https://admin.yourdomain.com",
    ]
elif settings.is_development():
    # Development overrides
    settings.DEBUG = True
    settings.LOG_SQL_QUERIES = True

class BaseAppException(Exception):
    """Base exception for application-specific errors"""
    pass

class ValidationError(BaseAppException):
    """Raised when validation fails"""
    pass

class AuthenticationError(BaseAppException):
    """Raised when authentication fails"""
    pass

class AuthorizationError(BaseAppException):
    """Raised when authorization fails"""
    pass

class RateLimitError(BaseAppException):
    """Raised when rate limit is exceeded"""
    pass

class SubscriptionError(BaseAppException):
    """Raised when subscription-related errors occur"""
    pass

class VectorStoreError(BaseAppException):
    """Raised when vector store operations fail"""
    pass

class LLMError(BaseAppException):
    """Raised when LLM operations fail"""
    pass

class TrainingError(BaseAppException):
    """Raised when training operations fail"""
    pass

class ChatError(BaseAppException):
    """Raised when chat operations fail"""
    pass

class ConfigurationError(BaseAppException):
    """Raised when configuration is invalid"""
    pass
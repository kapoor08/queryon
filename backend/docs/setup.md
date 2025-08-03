# Chat Widget RAG Backend - Complete Setup Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure Creation](#project-structure-creation)
4. [Environment Setup](#environment-setup)
5. [Dependencies Installation](#dependencies-installation)
6. [Code Implementation](#code-implementation)
7. [Database Setup](#database-setup)
8. [External Services Configuration](#external-services-configuration)
9. [Running the Server](#running-the-server)
10. [Testing the API](#testing-the-api)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is a production-ready RAG (Retrieval-Augmented Generation) backend for a multi-tenant chat widget SaaS. The system features:

- **Vector-based semantic search** using sentence transformers
- **LLM integration** with Ollama (qwen:0.5b for ultra-fast responses)
- **Multi-tenant architecture** with isolated user data
- **Subscription-based usage tracking**
- **Training endpoints** for dynamic document addition
- **Robust fallback mechanisms** for reliability

---

## 🛠 Prerequisites

### Required Software:

- **Python 3.11+** (we tested with Python 3.13)
- **PostgreSQL 15+**
- **Git** (for version control)
- **Ollama** (for local LLM)

### Required Accounts:

- **Pinecone** account (for vector storage)
- **OpenAI** account (optional, for embeddings backup)

---

## 📁 Project Structure Creation

### Step 1: Create Root Directory

```bash
mkdir chat-widget-backend
cd chat-widget-backend
```

### Step 2: Create Complete Folder Structure

```bash
# Windows Command Prompt
mkdir app
mkdir app\core
mkdir app\models
mkdir app\services
mkdir app\api
mkdir app\api\v1
mkdir app\schemas
mkdir app\utils
mkdir app\tasks
mkdir alembic
mkdir alembic\versions

# Create all Python files
echo. > app\__init__.py
echo. > app\main.py
echo. > app\core\__init__.py
echo. > app\core\config.py
echo. > app\core\database.py
echo. > app\core\security.py
echo. > app\core\exceptions.py
echo. > app\core\rate_limiter.py
echo. > app\models\__init__.py
echo. > app\models\base.py
echo. > app\models\user.py
echo. > app\models\widget.py
echo. > app\models\conversation.py
echo. > app\models\training.py
echo. > app\models\subscription.py
echo. > app\services\__init__.py
echo. > app\services\vector_store.py
echo. > app\services\embedding_service.py
echo. > app\services\llm_service.py
echo. > app\services\training_service.py
echo. > app\services\chat_service.py
echo. > app\services\cache_service.py
echo. > app\services\usage_service.py
echo. > app\services\subscription_service.py
echo. > app\api\__init__.py
echo. > app\api\deps.py
echo. > app\api\v1\__init__.py
echo. > app\api\v1\chat.py
echo. > app\api\v1\training.py
echo. > app\api\v1\widgets.py
echo. > app\api\v1\admin.py
echo. > app\schemas\__init__.py
echo. > app\schemas\base.py
echo. > app\schemas\chat.py
echo. > app\schemas\training.py
echo. > app\schemas\widget.py
echo. > app\schemas\user.py
echo. > app\utils\__init__.py
echo. > app\utils\text_processing.py
echo. > app\utils\document_loaders.py
echo. > app\utils\monitoring.py
echo. > app\utils\validators.py
echo. > app\tasks\__init__.py
echo. > app\tasks\celery_app.py
echo. > app\tasks\training_tasks.py

# Create config files
echo. > requirements.txt
echo. > .env.example
echo. > .env
echo. > docker-compose.yml
echo. > Dockerfile
echo. > README.md
echo. > setup_database.py
echo. > test_chat.py
```

### Step 3: Verify Structure

```bash
tree /F  # Windows
# or
find . -type f -name "*.py" | head -20  # Show first 20 Python files
```

---

## 🔧 Environment Setup

### Step 1: Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### Step 2: Generate Environment Variables

#### PostgreSQL Setup:

```bash
# Install PostgreSQL (Windows with Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/

# Start PostgreSQL service
net start postgresql-x64-16

# Create database
psql -U postgres
CREATE DATABASE chatbot_saas;
CREATE USER chatbot_user WITH ENCRYPTED PASSWORD 'secure123';
GRANT ALL PRIVILEGES ON DATABASE chatbot_saas TO chatbot_user;
\q
```

#### Generate Secret Key:

```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Example output: G_j40XZUes7gJDVdySo2BuhjbhvGNpfeR17CM9yhV1k
```

#### Get Pinecone API Key:

1. Go to [pinecone.io](https://pinecone.io)
2. Sign up for free account
3. Go to API Keys section
4. Copy your API key and environment

#### Create .env File:

```bash
# Environment
ENVIRONMENT=development
DEBUG=true

# Database
DATABASE_URL=postgresql+psycopg://chatbot_user:secure123@localhost:5432/chatbot_saas
ASYNC_DATABASE_URL=postgresql+psycopg://chatbot_user:secure123@localhost:5432/chatbot_saas

# Redis (install with Docker or locally)
REDIS_URL=redis://localhost:6379

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# Pinecone
PINECONE_API_KEY=your-actual-pinecone-api-key
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=chatbot-saas-main
PINECONE_DIMENSION=1024

# OpenAI (optional)
OPENAI_API_KEY=

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen:0.5b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# Embedding Settings
EMBEDDING_MODEL=nomic-embed-text
EMBEDDING_CHUNK_SIZE=1000
EMBEDDING_CHUNK_OVERLAP=200
EMBEDDING_BATCH_SIZE=50

# Security
SECRET_KEY=G_j40XZUes7gJDVdySo2BuhjbhvGNpfeR17CM9yhV1k

# Monitoring
LOG_LEVEL=INFO
```

---

## 📦 Dependencies Installation

### Step 1: Create requirements.txt

```txt
# FastAPI and server
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.35
psycopg[binary]==3.1.13
alembic==1.13.0

# Redis and Caching (UPDATED for async support)
redis[hiredis]==5.0.1
aioredis==2.0.1  # Alternative async Redis client if needed

# Background Tasks
celery==5.3.4

# AI/ML Libraries (UPDATED)
# Removed old langchain, updated Pinecone
pinecone-client==3.0.3  # UPDATED to latest version
openai==1.3.5
sentence-transformers==2.2.2  # ADDED for embedding model
scikit-learn==1.3.2  # ADDED for cosine similarity
numpy==1.24.3  # ADDED dependency for embeddings
torch==2.1.0  # ADDED for sentence-transformers (CPU version)

# HTTP Client (ADDED for async requests)
aiohttp==3.9.1  # ADDED for async HTTP requests
aiofiles==23.2.0  # ADDED for async file operations

# Document Processing
pypdf==3.17.1
python-docx==1.1.0
beautifulsoup4==4.12.2
requests==2.31.0  # Keep for backward compatibility
lxml==4.9.3  # ADDED for better HTML parsing

# Text Processing (ADDED)
langchain-text-splitters==0.0.1  # ADDED for text chunking
unstructured==0.11.6  # ADDED for advanced document processing

# Utilities
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0

# Validation and Security (ADDED)
email-validator==2.1.0  # ADDED for email validation
cryptography==41.0.7  # ADDED for enhanced security

# Monitoring and Logging
sentry-sdk[fastapi]==1.38.0
structlog==23.2.0  # ADDED for structured logging

# Development
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
black==23.11.0
isort==5.12.0
flake8==6.1.0
pytest-mock==3.12.0  # ADDED for better testing

# Production
gunicorn==21.2.0
```

### Step 2: Install Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify critical packages
python -c "import fastapi, sqlalchemy, pinecone, sentence_transformers; print('✅ All critical packages installed!')"
```

---

## 💻 Code Implementation

### Step 1: Copy Core Files

Copy the complete code for each file as provided in our conversation:

#### Essential Files (copy from artifacts):

1. **app/core/config.py** - Configuration management
2. **app/core/database.py** - Database connection
3. **app/core/exceptions.py** - Custom exceptions
4. **app/models/base.py** - Base model class
5. **app/models/user.py** - User and subscription models
6. **app/models/widget.py** - Widget and training document models
7. **app/schemas/chat.py** - Chat request/response schemas
8. **app/schemas/widget.py** - Widget management schemas
9. **app/schemas/training.py** - Training data schemas
10. **app/services/vector_store.py** - Pinecone integration
11. **app/api/v1/chat.py** - Main chat endpoint with LLM
12. **app/utils/document_loaders.py** - Document processing
13. **app/main.py** - FastAPI application
14. **setup_database.py** - Database initialization script

### Step 2: Test Configuration Loading

```bash
python -c "from app.core.config import settings; print('✅ Config loaded successfully!')"
```

---

## 🗄️ Database Setup

### Step 1: Initialize Database

```bash
# Run database setup script
python setup_database.py
```

### Step 2: Verify Database

```bash
# Test database connection
python -c "
from app.core.database import engine
from app.models.base import Base
Base.metadata.create_all(bind=engine)
print('✅ Database tables created!')
"
```

### Expected Output:

```
🗄️ Setting up database for RAG testing...
==================================================
Creating database tables...
✅ Tables created successfully!
Creating sample data...
✅ Sample data created!
👤 Test User ID: [uuid]
🔑 API Key: test_key_123
🎛️ Widget ID: [uuid]
📚 Training Documents: 3

✅ Database setup complete!
```

---

## 🔗 External Services Configuration

### Step 1: Setup Redis

```bash
# Option 1: Docker (recommended)
docker run -d -p 6379:6379 --name redis-chatbot redis:alpine

# Option 2: Local installation (Windows)
choco install redis-64

# Test Redis
python -c "import redis; r=redis.from_url('redis://localhost:6379'); r.ping(); print('✅ Redis connected!')"
```

### Step 2: Setup Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io)
2. Create new index:
   - **Name**: `chatbot-saas-main`
   - **Dimensions**: `1024`
   - **Metric**: `cosine`
   - **Pod Type**: `Starter` (free tier)

### Step 3: Setup Ollama

```bash
# Download and install Ollama from https://ollama.ai

# Pull required models
ollama pull qwen:0.5b              # Ultra-fast chat model (300MB)
ollama pull nomic-embed-text       # Embedding model (274MB)

# Verify models
ollama list

# Test Ollama
curl http://localhost:11434/api/tags
```

---

## 🚀 Running the Server

### Step 1: Start Required Services

```bash
# Start Redis (if not using Docker)
redis-server

# Start Ollama (usually auto-starts after installation)
ollama serve

# Verify services
curl http://localhost:11434/api/tags  # Ollama
python -c "import redis; redis.from_url('redis://localhost:6379').ping(); print('✅ All services running!')"
```

### Step 2: Start the Backend Server

```bash
# Development mode (with auto-reload)
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Production mode
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# With custom workers (production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Expected Startup Output:

```
INFO:     Will watch for changes in these directories: ['/.../backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXX] using WatchFiles
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
2025-08-03 00:44:29,568 - app.main - INFO - Starting Chat Widget RAG Backend
2025-08-03 00:44:29,568 - app.main - INFO - Environment: Environment.DEVELOPMENT
2025-08-03 00:44:29,568 - app.main - INFO - Debug mode: True
INFO:     Application startup complete.
```

---

## 🧪 Testing the API

### Step 1: Health Check

```bash
curl http://127.0.0.1:8000/health
```

**Expected Response:**

```json
{
  "status": "healthy",
  "environment": "development",
  "version": "1.0.0",
  "features": {
    "chat_available": true,
    "models_available": true,
    "database_configured": true,
    "pinecone_configured": true
  }
}
```

### Step 2: Test Chat Endpoint

```bash
# Simple question
curl -X POST "http://127.0.0.1:8000/api/v1/chat/chat" \
-H "Content-Type: application/json" \
-d '{
  "api_key": "test_key_123",
  "message": "What are your key features?",
  "session_id": "test_1"
}'

# Complex question (should use LLM)
curl -X POST "http://127.0.0.1:8000/api/v1/chat/chat" \
-H "Content-Type: application/json" \
-d '{
  "api_key": "test_key_123",
  "message": "I run a growing e-commerce business. Which pricing plan would you recommend?",
  "session_id": "test_2"
}'
```

### Step 3: Test Training Endpoint

```bash
# Add new training data
curl -X POST "http://127.0.0.1:8000/api/v1/training/add" \
-H "Content-Type: application/json" \
-d '{
  "api_key": "test_key_123",
  "title": "Installation Guide",
  "content": "To install our widget: 1) Copy embed code, 2) Paste in HTML, 3) Customize in dashboard."
}'

# List training documents
curl -X GET "http://127.0.0.1:8000/api/v1/training/list?api_key=test_key_123"
```

### Step 4: Test Analytics

```bash
curl -X GET "http://127.0.0.1:8000/api/v1/analytics?api_key=test_key_123"
```

### Step 5: Use Test Script

```bash
# Run comprehensive tests
python test_chat.py
```

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **"psycopg2-binary" Installation Failed**

```bash
# Solution: Use psycopg3
pip uninstall psycopg2-binary
pip install "psycopg[binary]"
```

#### 2. **"SQLAlchemy metadata reserved" Error**

- Ensure you're using the corrected models with `document_metadata` instead of `metadata`

#### 3. **"Pinecone Index Not Found"**

```bash
# Create index manually in Pinecone console or check index name in .env
```

#### 4. **"Ollama Connection Failed"**

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

#### 5. **"Vector Search Slow"**

- First request takes 30-60 seconds (downloads embedding model)
- Subsequent requests are fast (model cached)

#### 6. **"LLM Timeout"**

- Expected behavior - system falls back to template responses
- Response still fast and functional

### Performance Optimization:

#### 1. **Preload Models**

```python
# Add to startup event in main.py
from .api.v1.chat import get_embedding_model
get_embedding_model()  # Preload on startup
```

#### 2. **Optimize for Production**

```bash
# Use multiple workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Use production database
DATABASE_URL=postgresql+psycopg://user:pass@production-host:5432/db
```

### Monitoring:

#### 1. **Check Logs**

```bash
tail -f logs/app.log  # If logging to file
```

#### 2. **Monitor Performance**

```bash
# Check response times in server logs
# Monitor vector search batch processing
```

---

## 🎯 API Endpoints Summary

| Endpoint                | Method | Description                   |
| ----------------------- | ------ | ----------------------------- |
| `/health`               | GET    | System health check           |
| `/api/v1/chat/chat`     | POST   | Main chat endpoint            |
| `/api/v1/training/add`  | POST   | Add training data             |
| `/api/v1/training/list` | GET    | List training documents       |
| `/api/v1/analytics`     | GET    | Usage analytics               |
| `/docs`                 | GET    | Interactive API documentation |

---

## 🎉 Deployment Ready!

Your RAG backend is now:

- ✅ **Production-ready** with proper error handling
- ✅ **Scalable** with multi-tenant architecture
- ✅ **Fast** with optimized LLM integration
- ✅ **Reliable** with multiple fallback layers
- ✅ **Intelligent** with vector search + LLM
- ✅ **Monitored** with comprehensive logging

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Test individual components (database, Redis, Ollama) separately
4. Verify all environment variables are set correctly

**Your chat widget RAG backend is ready for production use!** 🚀

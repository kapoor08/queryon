#!/usr/bin/env python3
"""
Database setup script - Creates tables and sample data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine
from app.models.base import Base
from app.models.user import User, UsageLog
from app.models.widget import Widget, TrainingDocument
from app.models.conversation import Conversation, Message
from app.core.config import SubscriptionPlan
from sqlalchemy.orm import sessionmaker
import uuid

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

def create_sample_data():
    """Create sample user and widget for testing"""
    print("Creating sample data...")
    
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.api_key == "test_key_123").first()
        if existing_user:
            print("✅ Test user already exists!")
            return existing_user.id
        
        # Create test user
        user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            full_name="Test User",
            api_key="test_key_123",
            subscription_plan=SubscriptionPlan.PRO,
            is_active=True,
            is_subscription_active=True,
            queries_used_today=0,
            total_queries_lifetime=0
        )
        db.add(user)
        db.flush()
        
        # Create test widget
        widget = Widget(
            id=str(uuid.uuid4()),
            user_id=user.id,
            name="Test Product Assistant",
            description="A test widget for RAG functionality",
            pinecone_namespace=f"user_{user.id}_widget_{str(uuid.uuid4())}",
            system_prompt="You are a helpful product assistant. Answer questions based on the provided context about our amazing product.",
            welcome_message="Hello! I'm here to help you learn about our product. What would you like to know?",
            theme_color="#007bff",
            is_active=True
        )
        db.add(widget)
        db.flush()
        
        # Add some sample training data
        training_docs = [
            {
                "title": "Product Overview",
                "content": """Our amazing product is an AI-powered chat widget that can be embedded into any website. 
                It features advanced natural language processing, real-time responses, and easy integration. 
                The product helps businesses provide 24/7 customer support and improve user engagement.""",
                "content_type": "text"
            },
            {
                "title": "Features",
                "content": """Key features include:
                - Easy integration with any website
                - Customizable appearance and branding
                - Multi-language support
                - Real-time analytics and reporting
                - Advanced AI capabilities
                - 24/7 availability
                - Mobile-responsive design""",
                "content_type": "text"
            },
            {
                "title": "Pricing",
                "content": """We offer three pricing tiers:
                - Starter: $9/month - 50 queries/day, 1 widget, email support
                - Pro: $29/month - 500 queries/day, 3 widgets, priority support
                - Enterprise: $99/month - unlimited queries, 10+ widgets, dedicated support""",
                "content_type": "text"
            }
        ]
        
        for doc_data in training_docs:
            doc = TrainingDocument(
                id=str(uuid.uuid4()),
                widget_id=widget.id,
                title=doc_data["title"],
                content=doc_data["content"],
                content_type=doc_data["content_type"],
                is_processed=True,
                chunk_count=1
            )
            db.add(doc)
        
        db.commit()
        
        print(f"✅ Sample data created!")
        print(f"👤 Test User ID: {user.id}")
        print(f"🔑 API Key: {user.api_key}")
        print(f"🎛️ Widget ID: {widget.id}")
        print(f"📚 Training Documents: {len(training_docs)}")
        
        return user.id
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
        return None
    finally:
        db.close()

if __name__ == "__main__":
    print("🗄️ Setting up database for RAG testing...")
    print("=" * 50)
    
    try:
        create_tables()
        user_id = create_sample_data()
        
        if user_id:
            print("\n✅ Database setup complete!")
            print("\n🧪 You can now test with:")
            print("API Key: test_key_123")
            print("Endpoint: http://127.0.0.1:8000/api/v1/chat/chat")
            print("\n📝 Try asking questions like:")
            print("- 'What is your product?'")
            print("- 'What features do you offer?'")
            print("- 'How much does it cost?'")
        else:
            print("❌ Database setup failed!")
            
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        print("Make sure your database is running and .env is configured correctly.")
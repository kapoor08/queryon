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
from app.core.config import SubscriptionPlan
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text  # Import text for raw SQL
import uuid
import datetime


def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False


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
            print(f"👤 Test User ID: {existing_user.id}")
            print(f"🔑 API Key: {existing_user.api_key}")

            # Check if widget exists
            widget = db.query(Widget).filter(Widget.user_id == existing_user.id).first()
            if widget:
                print(f"🎛️ Widget ID: {widget.id}")

                # Check training documents
                doc_count = (
                    db.query(TrainingDocument)
                    .filter(TrainingDocument.widget_id == widget.id)
                    .count()
                )
                print(f"📚 Training Documents: {doc_count}")

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
            total_queries_lifetime=0,
            last_query_reset=datetime.datetime.utcnow(),
            subscription_start_date=datetime.datetime.utcnow(),
        )
        db.add(user)
        db.flush()  # Get the user ID

        # Create test widget
        widget = Widget(
            id=str(uuid.uuid4()),
            user_id=user.id,
            name="Test Product Assistant",
            description="A test widget for RAG functionality",
            pinecone_namespace=f"user_{user.id}_widget_{str(uuid.uuid4())[:8]}",
            system_prompt="You are a helpful product assistant. Answer questions based on the provided context about our amazing product.",
            welcome_message="Hello! I'm here to help you learn about our product. What would you like to know?",
            theme_color="#007bff",
            is_active=True,
            training_status="completed",  # Mark as completed so it can be used
        )
        db.add(widget)
        db.flush()  # Get the widget ID

        # Add some sample training data
        training_docs = [
            {
                "title": "Product Overview",
                "content": """Our amazing product is an AI-powered chat widget that can be embedded into any website. 
                It features advanced natural language processing, real-time responses, and easy integration. 
                The product helps businesses provide 24/7 customer support and improve user engagement.""",
                "content_type": "text",
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
                "content_type": "text",
            },
            {
                "title": "Pricing",
                "content": """We offer three pricing tiers:
                - Starter: $9/month - 50 queries/day, 1 widget, email support
                - Pro: $29/month - 500 queries/day, 3 widgets, priority support
                - Enterprise: $99/month - unlimited queries, 10+ widgets, dedicated support""",
                "content_type": "text",
            },
        ]

        for doc_data in training_docs:
            doc = TrainingDocument(
                id=str(uuid.uuid4()),
                widget_id=widget.id,
                title=doc_data["title"],
                content=doc_data["content"],
                content_type=doc_data["content_type"],
                is_processed=True,
                chunk_count=1,
            )
            db.add(doc)

        # Update widget with document counts
        widget.total_documents = len(training_docs)
        widget.total_chunks = len(training_docs)
        widget.last_training_date = datetime.datetime.utcnow()

        db.commit()

        print(f"✅ Sample data created!")
        print(f"👤 Test User ID: {user.id}")
        print(f"🔑 API Key: {user.api_key}")
        print(f"🎛️ Widget ID: {widget.id}")
        print(f"📚 Training Documents: {len(training_docs)}")

        return user.id

    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        print(f"Error details: {type(e).__name__}: {str(e)}")
        db.rollback()
        return None
    finally:
        db.close()


def test_database_connection():
    """Test if database connection works"""
    print("Testing database connection...")
    try:
        # Test basic connection using proper SQLAlchemy syntax
        from app.core.database import SessionLocal

        db = SessionLocal()

        # Use text() for raw SQL - FIXED
        result = db.execute(text("SELECT 1 as test")).fetchone()
        db.close()

        if result and result[0] == 1:
            print("✅ Database connection successful!")
            return True
        else:
            print("❌ Database connection failed!")
            return False

    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False


def create_database_if_not_exists():
    """Try to create database if it doesn't exist"""
    print("Checking if database exists...")
    try:
        # Try to connect to default postgres database first
        import psycopg
        from app.core.config import settings

        # Parse the database URL
        db_url = settings.DATABASE_URL
        if "chatbot_saas" in db_url:
            # Try to connect to default postgres db to create our database
            default_url = db_url.replace("/chatbot_saas", "/postgres")

            try:
                conn = psycopg.connect(
                    default_url.replace("postgresql+psycopg://", "postgresql://")
                )
                conn.autocommit = True
                cur = conn.cursor()

                # Check if database exists
                cur.execute(
                    "SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'chatbot_saas'"
                )
                exists = cur.fetchone()

                if not exists:
                    print("Creating chatbot_saas database...")
                    cur.execute("CREATE DATABASE chatbot_saas")
                    print("✅ Database created successfully!")
                else:
                    print("✅ Database already exists!")

                cur.close()
                conn.close()
                return True

            except Exception as e:
                print(f"Could not create database: {e}")
                return False

        return True

    except Exception as e:
        print(f"Database check failed: {e}")
        return False


if __name__ == "__main__":
    print("🗄️ Setting up database for RAG testing...")
    print("=" * 50)

    try:
        # Try to create database if needed
        create_database_if_not_exists()

        # Test connection
        if not test_database_connection():
            print("\n❌ Database connection failed!")
            print("Please check:")
            print("1. PostgreSQL is running")
            print("2. Database 'chatbot_saas' exists")
            print("3. Credentials in .env are correct")
            print("4. Database URL in .env is correct")

            # Print connection details for debugging
            try:
                from app.core.config import settings

                print(f"\nCurrent DATABASE_URL: {settings.DATABASE_URL}")
            except:
                print("Could not load database URL from config")

            print("\n🔧 Quick fix commands:")
            print("# Connect to PostgreSQL and create database:")
            print("psql -U postgres -h localhost")
            print("CREATE DATABASE chatbot_saas;")
            print("\\q")

            # Try to continue anyway for testing
            print("\n⚠️ Continuing anyway - some features may not work...")

        # Create tables
        if not create_tables():
            print("❌ Failed to create tables!")
            print("Trying to continue anyway...")

        # Create sample data
        user_id = create_sample_data()

        if user_id:
            print("\n✅ Database setup complete!")
        else:
            print(
                "\n⚠️ Sample data creation failed, but you can still test basic functionality"
            )

        print("\n🧪 You can now test with:")
        print("API Key: test_key_123")
        print("Endpoint: http://127.0.0.1:8000/api/v1/chat/chat")
        print("\n📝 Try asking questions like:")
        print("- 'What is your product?'")
        print("- 'What features do you offer?'")
        print("- 'How much does it cost?'")
        print("\n🔍 Test commands:")
        print('curl -X GET "http://127.0.0.1:8000/health"')
        print(
            'curl -X POST "http://127.0.0.1:8000/api/v1/chat/chat" -H "Content-Type: application/json" -d "{\\"api_key\\": \\"test_key_123\\", \\"message\\": \\"What is your product?\\", \\"session_id\\": \\"test_1\\"}"'
        )

    except Exception as e:
        print(f"❌ Setup failed: {e}")
        print("Make sure PostgreSQL is running and credentials are correct.")

        print("\n🔧 Troubleshooting:")
        print("1. Install PostgreSQL: https://www.postgresql.org/download/")
        print("2. Start PostgreSQL service")
        print("3. Create database: CREATE DATABASE chatbot_saas;")
        print("4. Update .env with correct credentials")

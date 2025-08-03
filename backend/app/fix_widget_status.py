#!/usr/bin/env python3
"""
Quick fix for widget training status
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine
from app.models.user import User
from app.models.widget import Widget, TrainingDocument
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text


def fix_widget_status():
    """Fix widget training status"""
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        # Find test user
        user = db.query(User).filter(User.api_key == "test_key_123").first()
        if not user:
            print("❌ Test user not found! Run setup_database.py first.")
            return False

        print(f"✅ Found user: {user.email}")

        # Find widget
        widget = db.query(Widget).filter(Widget.user_id == user.id).first()
        if not widget:
            print("❌ Widget not found!")
            return False

        print(f"✅ Found widget: {widget.name}")
        print(f"Current training status: {widget.training_status}")

        # Count training documents
        doc_count = (
            db.query(TrainingDocument)
            .filter(TrainingDocument.widget_id == widget.id)
            .count()
        )

        print(f"Training documents: {doc_count}")

        if doc_count > 0:
            # Update widget to completed status
            widget.training_status = "completed"
            widget.total_documents = doc_count
            widget.total_chunks = doc_count

            db.commit()
            print(f"✅ Updated widget training status to 'completed'")
            print(f"✅ Set document count to {doc_count}")
            return True
        else:
            print("❌ No training documents found!")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    print("🔧 Fixing widget training status...")
    if fix_widget_status():
        print("\n✅ Widget status fixed!")
        print("Now test again with:")
        print(
            'curl -X POST "http://127.0.0.1:8000/api/v1/chat/chat" -H "Content-Type: application/json" -d "{\\"api_key\\": \\"test_key_123\\", \\"message\\": \\"What is your product?\\", \\"session_id\\": \\"test_5\\"}"'
        )
    else:
        print("\n❌ Fix failed! Try running setup_database.py first.")

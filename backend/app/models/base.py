from sqlalchemy import Column, Integer, DateTime, Boolean, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import uuid

Base = declarative_base()


class TimestampMixin:
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


class UUIDMixin:
    id = Column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )


class BaseModel(Base, TimestampMixin, UUIDMixin):
    __abstract__ = True

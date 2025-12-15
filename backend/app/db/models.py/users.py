from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"


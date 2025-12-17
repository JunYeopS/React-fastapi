from sqlalchemy import Column, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.sql import func

from app.db.base import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)

    post_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    author_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    content = Column(Text, nullable=False)

    is_anonymous = Column(
        Boolean,
        nullable=False,
        server_default="0"
    )

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

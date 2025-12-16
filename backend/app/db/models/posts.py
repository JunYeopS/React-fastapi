from sqlalchemy import Column, DateTime, String, Text, ForeignKey
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.sql import func

from app.db.base import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    author_id = Column(BIGINT(unsigned=True), 
                       ForeignKey("users.id", ondelete="CASCADE"),  # 작성자 FK (유저 삭제 시 게시글 자동 삭제)
                       nullable=False, index=True)                  # 작성자 필수, 조회/조인 성능용 인덱스
    
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

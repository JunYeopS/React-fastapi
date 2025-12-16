from pydantic import BaseModel, Field
from datetime import datetime

class PostCreate(BaseModel):
    title: str = Field(..., max_length=200)
    content: str = Field(..., min_length=1)
    
class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author: str
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }
    
class PostListResponse(BaseModel):
    items: list[PostResponse]
    limit: int
    offset: int
    total: int
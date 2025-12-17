from pydantic import BaseModel, Field
from datetime import datetime


class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1)
    is_anonymous: bool = False

class CommentResponse(BaseModel):
    id: int
    content: str
    author: str
    is_anonymous: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


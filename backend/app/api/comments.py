from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.comments import Comment
from app.db.models.posts import Post
from app.db.models.users import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=list[CommentResponse])
def list_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = (
        db.query(Comment, User.username)
        .join(User, Comment.author_id == User.id)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )

    return [
        CommentResponse(
            id=c.Comment.id,
            content=c.Comment.content,
            author="익명" if c.Comment.is_anonymous else c.username,
            is_anonymous=c.Comment.is_anonymous,
            created_at=c.Comment.created_at,
        )
        for c in comments
    ]

@router.post(
    "/",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_comment(
    post_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = Comment(
        post_id=post_id,
        author_id=current_user.id,
        content=comment_in.content,
        is_anonymous=comment_in.is_anonymous,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    author = "익명" if comment.is_anonymous else current_user.username

    return CommentResponse(
        id=comment.id,
        content=comment.content,
        author=author,
        is_anonymous=comment.is_anonymous,
        created_at=comment.created_at,
    )

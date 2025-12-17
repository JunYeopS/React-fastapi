from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.db.session import get_db
from app.db.models.posts import Post
from app.schemas.post import PostCreate, PostResponse, PostListResponse
from app.db.models.users import User
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/posting", response_model=PostResponse,status_code=status.HTTP_201_CREATED)
def create_post(post_in: PostCreate, 
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user),):
    
    #Post 생성 
    post = Post(
        title = post_in.title,
        content= post_in.content,
        author_id=current_user.id,  
    )
    
    # DB 저장 
    db.add(post)
    db.commit()
    db.refresh(post)
    
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "author": current_user.username,
        "created_at": post.created_at,
    }
    
@router.get("/", response_model=PostListResponse,status_code=status.HTTP_200_OK)
def list_posts(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    # 전체 개수
    total = db.execute(
        select(func.count()).select_from(Post)
    ).scalar_one()

    # 실제 데이터
    stmt = (
        select(
            Post.id,
            Post.title,
            Post.content,
            Post.created_at,
            User.username.label("author"),
        )
        .join(User, Post.author_id == User.id)
        .order_by(Post.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    rows = db.execute(stmt).all()

    items = [{
            "id": r.id,
            "title": r.title,
            "content":r.content,
            "author": r.author,
            "created_at": r.created_at,
        }
        for r in rows
    ]

    return {
        "items": items,
        "limit": limit,
        "offset": offset,
        "total": total,
    }
    
@router.get("/{post_id}", response_model=PostResponse, status_code= status.HTTP_200_OK)
def get_post(
    post_id: int, db: Session = Depends(get_db),
    ):
    
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    author = db.get(User, post.author_id)

    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "author": author.username if author else None,
        "created_at": post.created_at,
    }    
    
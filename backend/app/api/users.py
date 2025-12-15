from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.users import User
from app.schemas.user import UserCreate, UserResponse
router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED,)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(User.username == user_in.username)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    # User 생성 (temp: password 평문 저장)
    user = User(
        username=user_in.username,
        password=user_in.password,  # TODO: hash later
    )

    # DB 저장
    db.add(user)
    db.commit()
    db.refresh(user)

    return user
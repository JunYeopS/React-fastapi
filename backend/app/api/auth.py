from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.users import User
from app.schemas.auth import LoginRequest

router = APIRouter()

@router.post("/login")
def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    # username으로 사용자 조회
    user = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    # 사용자 없거나 비밀번호 불일치
    if not user or user.password != data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # 세션에 user_id 저장 (⭐)
    request.session["user_id"] = user.id

    return {
        "id": user.id,
        "username": user.username,
    }

@router.get("/me")
def me(request: Request, db: Session = Depends(get_db)):
    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = db.query(User).get(user_id)
    if not user:
        # 세션은 있는데 유저가 없는 경우
        request.session.clear()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )

    return {
        "id": user.id,
        "username": user.username,
    }
    
@router.post("/logout")
def logout(request: Request):
    # 세션 제거
    request.session.clear()
    
    return {"message": "logged out"}
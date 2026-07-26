
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import follow as follow_crud
from app.model.user import User
from app.schemas.user import UserResponse
from ..auth.dependencies import get_current_user
router = APIRouter(
    prefix="/follow",
    tags=["follow"]
)

@router.post("/{user_id}/follow")
def follow_user_route(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return follow_crud.follow_user(db, current_user.id, user_id)


@router.delete("/{user_id}/unfollow")
def unfollow_user_route(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return follow_crud.unfollow_user(db, current_user.id, user_id)


@router.get("/{user_id}/followers", response_model=list[UserResponse])
def list_followers(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return follow_crud.get_followers(db, user_id)


@router.get("/{user_id}/following", response_model=list[UserResponse])
def list_following(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return follow_crud.get_following(db, user_id)
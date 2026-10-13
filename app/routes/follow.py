
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import follow as follow_crud
from ..crud import user as user_crud
from app.model.user import User
from app.schemas.user import UserResponse
from ..auth.dependencies import get_current_user
from ..cache import (
    FOLLOW_TTL,
    cache,
    dump_user,
    followers_key,
    following_key,
    invalidate_follow,
)
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
    result = follow_crud.follow_user(db, current_user.id, user_id)
    db.refresh(current_user)
    followed = user_crud.get_user_by_id(db, user_id)
    invalidate_follow(current_user, followed)
    return result


@router.delete("/{user_id}/unfollow")
def unfollow_user_route(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = follow_crud.unfollow_user(db, current_user.id, user_id)
    db.refresh(current_user)
    followed = user_crud.get_user_by_id(db, user_id)
    invalidate_follow(current_user, followed)
    return result


@router.get("/{user_id}/followers", response_model=list[UserResponse])
def list_followers(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    key = followers_key(user_id)
    cached = cache.get_json(key)
    if cached is not None:
        return cached

    users = follow_crud.get_followers(db, user_id)
    data = [dump_user(user) for user in users]
    cache.set_json(key, data, FOLLOW_TTL)
    return data


@router.get("/{user_id}/following", response_model=list[UserResponse])
def list_following(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    key = following_key(user_id)
    cached = cache.get_json(key)
    if cached is not None:
        return cached

    users = follow_crud.get_following(db, user_id)
    data = [dump_user(user) for user in users]
    cache.set_json(key, data, FOLLOW_TTL)
    return data
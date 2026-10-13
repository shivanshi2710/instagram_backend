from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db

from ..schemas.user import (
    UserCreate,
    UserResponse,
    UserUpdate
)

from ..auth.dependencies import get_current_user
from ..crud import user as user_crud
from app.model.user import User
from ..cache import (
    USER_TTL,
    USERS_ALL_TTL,
    cache,
    dump_user,
    invalidate_user,
    posts_key,
    user_id_key,
    user_username_key,
    users_all_key,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        existing_user = user_crud.get_user_by_email(
            db,
            user.email
        )
        if existing_user:
            raise HTTPException(status_code=409, detail="user already existed")

        new_user =  user_crud.create_user(
            db,
            user
        )
        cache.delete(users_all_key())
        return new_user
    except Exception as e:
        print("error occurred while creating user",e)
        raise e

@router.get("/all_users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        key = users_all_key()
        cached = cache.get_json(key)
        if cached is not None:
            return cached

        users = user_crud.get_all(db)
        data = [dump_user(item) for item in users]
        cache.set_json(key, data, USERS_ALL_TTL)
        return data
    except Exception as e:
        print("error while getting all users")
        raise e


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        key = user_id_key(user_id)
        cached = cache.get_json(key)
        if cached is not None:
            return cached

        new_user = user_crud.get_user_by_id(
            db,
            user_id
        )
        if new_user is None:
            raise HTTPException(status_code=404, detail="user not found")
        data = dump_user(new_user)
        cache.set_json(key, data, USER_TTL)
        cache.set_json(user_username_key(new_user.username), data, USER_TTL)
        return data
    except Exception as e:
        raise e 

@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        key = user_username_key(username)
        cached = cache.get_json(key)
        if cached is not None:
            return cached

        db_user =  user_crud.get_user_by_username(
            username,
            db
        )
        if db_user is None:
            raise HTTPException(status_code=404, detail="user not found")
        data = dump_user(db_user)
        cache.set_json(key, data, USER_TTL)
        cache.set_json(user_id_key(db_user.id), data, USER_TTL)
        return data
    except Exception as e:
        raise e

@router.patch("/update_user_by_id", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        old_username = current_user.username
        db_user =  user_crud.update_user(
            db,
            current_user.id,
            user_update
        )
        cache.delete(
            user_id_key(current_user.id),
            user_username_key(old_username),
            users_all_key(),
        )
        if db_user is not None:
            cache.delete(user_username_key(db_user.username))
        return db_user
    except Exception as e:
        raise e
    


@router.delete("/delete_user_by_id")
def delete_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_user = user_crud.delete_user(
            db,
            current_user.id
        )
        invalidate_user(current_user)
        cache.delete(posts_key(current_user.id))
        return db_user
    except Exception as e:
        raise e
    

    
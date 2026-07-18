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
        return new_user
    except Exception as e:
        print("error occurred while creating user",e)
        raise e

@router.get("/", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        new_user = user_crud.get_all(db)
        return new_user
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
        new_user = user_crud.get_user_by_id(
            db,
            user_id
        )
        if new_user is None:
            raise HTTPException(status_code=404, detail="user not found")
        return new_user
    except Exception as e:
        raise e 

@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_user =  user_crud.get_user_by_username(
            db,
            username
        )
        if db_user is None:
            raise HTTPException(status_code=404, detail="user not found")
        return db_user
    except Exception as e:
        raise e

@router.patch("/update_user_by_id", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_user =  user_crud.update_user(
            db,
            current_user.id,
            user_update
        ) 
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
        return db_user
    except Exception as e:
        raise e
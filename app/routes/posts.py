from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.post import (
    PostCreate,
    PostResponse,
    PostUpdate
)

from app.model.user import User

from ..auth.dependencies import get_current_user

from ..crud import posts as post_crud 

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.post("/", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return post_crud.create_post(
        db,
        post
    )


@router.get("/", response_model=list[PostResponse])
def get_all_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return post_crud.get_all_posts(db)


@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):

    return post_crud.get_post(
        db,
        post_id
    )


@router.patch("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return post_crud.update_post(
        db,
        post_id,
        post_update
    )


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return post_crud.delete_post(
        db,
        post_id
    )
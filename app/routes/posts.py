from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, File
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


@router.post("/create-post", response_model=PostResponse)
def create_post(
    content: str = Form(...),
    caption: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        print(content)
        print(caption)
        print(image.filename)

        # new_post = post_crud.create_post(
        #     db,
        #     post,
        #     current_user.id
        # )
        # return new_post
        return 
    except Exception as e:
        raise e

@router.get("/get_all_post_by_user_id", response_model=list[PostResponse])
def get_all_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        posts =  post_crud.get_all_posts(db,current_user.id)
        return posts
    except Exception as e:
        raise e


@router.get("/get_post_by_post_id/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    try:
        return post_crud.get_post(
            db,
            post_id
        )
    except Exception as e:
        raise e


@router.patch("/update_post/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        post = post_crud.get_post(post_id, db)
        if post.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to update this post."
            )
        return post_crud.update_post(
            db,
            post_update,
            post
        )
    except Exception as e:
        raise e

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
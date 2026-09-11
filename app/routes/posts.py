from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, File
from sqlalchemy.orm import Session
from app.crud import likes as like_crud
from ..database import get_db
from ..model.posts import Post
from ..schemas.post import (
    PostCreate,
    PostResponse,
    PostUpdate
)

from app.model.user import User
from ..model.comment import Comment
from ..crud import comment as comment_crud
from ..auth.dependencies import get_current_user

from ..crud import posts as post_crud
from ..utils.azure import upload_to_azure, delete_from_azure

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
        image_url = upload_to_azure(image)
        new_post = post_crud.create_post(
            db,
            content,
            caption,
            image_url,
            current_user.id
        )
        return new_post
        return
    except Exception as e:
        raise e


@router.get("/get_all_post_by_user_id", response_model=list[PostResponse])
def get_all_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        posts = post_crud.get_all_posts(db, current_user.id)
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
            post_id,
            db
        )
    except Exception as e:
        raise e


@router.patch("/update_post/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    caption: str | None = Form(None),
    content: str | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    post = post_crud.get_post(post_id, db)

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this post."
        )

    image_url = None

    if image is not None:
        if post.image_url:
            delete_from_azure(post.image_url)

        image_url = upload_to_azure(image)

    return post_crud.update_post(
        db=db,
        post=post,
        caption=caption,
        content=content,
        image_url=image_url
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


@router.post("/posts/{post_id}/like")
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return like_crud.like_post(
        db=db,
        user_id=current_user.id,
        post_id=post_id
    )


@router.post("/posts/{post_id}/comments")
def add_comment(
    post_id: int,
    content: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return comment_crud.create_comment(
        db=db,
        content=content,
        user_id=current_user.id,
        post_id=post_id
    )


@router.get("/posts/{post_id}/comments")
def get_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return comment_crud.get_comments(
        db=db,
        post_id=post_id
    )


@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(
        Comment.id == comment_id
    ).first()

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )

    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to delete this comment."
        )

    return comment_crud.delete_comment(
        db=db,
        comment=comment

    )
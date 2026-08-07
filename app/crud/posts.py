from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.model.posts import Post
from app.model.user import User


from ..schemas.post import (
    PostCreate,
    PostUpdate
)


def create_post(
    db: Session,
    content: str,
    caption: str,
    image_url:str,
    user_id: int
):

    # Check if user exists
    user = db.query(User).filter(
        User.id ==user_id
    ).first()
    if user is not None:
        db_post = Post(
            content=content,
            caption=caption,
            image_url=image_url,
            user_id=user_id
        )

        db.add(db_post)
        db.commit()
        db.refresh(db_post)

        return db_post
    

def get_all_posts(
    db: Session,
    user_id: int
):
     
    new_user = db.query(Post).filter(Post.user_id == user_id).all()
    return new_user



def get_post(
    post_id: int,
    db: Session,
):
    
    post = db.query(Post).filter(
        Post.id == post_id
    ).first()

    return post


def update_post(
    db: Session,
    post: Post,
    caption: str | None,
    content: str | None,
    image_url: str | None
):

    if caption is not None:
        post.caption = caption

    if content is not None:
        post.content = content

    if image_url is not None:
        post.image_url = image_url

    db.commit()
    db.refresh(post)

    return post



def delete_post(
    db: Session,
    post_id: int,
    current_user: User
):
    post = db.query(Post).filter(
        Post.id == post_id
    ).first()
    db.delete(post)
    db.commit()

    return post

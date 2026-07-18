from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.model.posts import Post
from app.model.user import User


from ..schemas.post import (
    PostCreate,
    PostUpdate
)


def create_post(
    post: PostCreate,
    db: Session,
    current_user: User
):
    try:
    # Check if user exists
        user = db.query(User).filter(
            User.id == post.user_id
        ).first()

        if user is None:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        db_post = Post(
            content=post.content,
            caption=post.caption,
            image_url=post.image_url,
            user_id=post.user_id
        )

        db.add(db_post)
        db.commit()
        db.refresh(db_post)

        return db_post
    except Exception as e:
        print("error while creating post")
        raise e

def get_all_posts(
    db: Session,
    current_user: User
):
    try: 
        new_user = db.query(Post).all()
        return new_user
    except Exception as e:
        print("error while getting all posts")
        raise e


def get_post(
    post_id: int,
    db: Session,
    current_user: User
):
    try:
        post = db.query(Post).filter(
            Post.id == post_id
        ).first()

        if post is None:

            raise HTTPException(
                status_code=404,
                detail="Post not found"
            )

        return post
    except Exception as e:
        print("error while getting post by post_id")


def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session,
    current_user: User
):
    try:
        post = db.query(Post).filter(
            Post.id == post_id
        ).first()

        if post is None:

            raise HTTPException(
                status_code=404,
                detail="Post not found"
            )

        if post_update.caption is not None:
            post.caption = post_update.caption

        if post_update.content is not None:
            post.content = post_update.content

        if post_update.image_url is not None:
            post.image_url = post_update.image_url

        db.commit()
        db.refresh(post)

        return post
    except Exception as e:
        print("error while updating post")
        raise e


def delete_post(
    db: Session,
    post_id: int,
    current_user: User
):
    try:

        post = db.query(Post).filter(
            Post.id == post_id
        ).first()

        if post is None:

            raise HTTPException(
                status_code=404,
                detail="Post not found"
            )

        db.delete(post)
        db.commit()

        return {
            "message": "Post deleted successfully"
        }
    except Exception as e:
        print("error while deleting post")
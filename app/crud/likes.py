from sqlalchemy.orm import Session
from app.model.likes import Like


def like_post(
    db: Session,
    user_id: int,
    post_id: int
):

    existing_like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.post_id == post_id
    ).first()

    if existing_like:
        db.delete(existing_like)
        db.commit()

        return {
            "message": "Post unliked"
        }

    new_like = Like(
        user_id=user_id,
        post_id=post_id
    )

    db.add(new_like)
    db.commit()

    return {
        "message": "Post liked"
    }
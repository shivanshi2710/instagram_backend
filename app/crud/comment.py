from sqlalchemy.orm import Session

from ..model.comment import Comment


def create_comment(
    db: Session,
    content: str,
    user_id: int,
    post_id: int
):
    new_comment = Comment(
        content=content,
        user_id=user_id,
        post_id=post_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment


def get_comments(
    db: Session,
    post_id: int
):
    return db.query(Comment).filter(
        Comment.post_id == post_id
    ).all()


def delete_comment(
    db: Session,
    comment: Comment
):
    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted"}
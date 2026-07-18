from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.model.user import User


def authenticate_user(
    db: Session,
    username: str
):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

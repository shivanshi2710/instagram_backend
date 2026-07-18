
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.model.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.password import hash_password
from app.email_service import send_signup_email


def create_user(
    db: Session,
    user: UserCreate
):
    try:
        new_user = User(
            full_name=user.full_name,
            username=user.username,
            email=user.email,
            password_hash=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        send_signup_email(
            new_user.email,
            new_user.full_name
        )
        return new_user
    except Exception as e:
        print("error while creating user", e)
        raise e


def get_all(db: Session, current_user: User):
    try:
        user = db.query(User).all()
        return user
    except Exception as e:
        print("error while getting all users")
        raise e


def get_user_by_id(
    user_id: int,
    db: Session,
    current_user: User
): 
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    return user
    

def get_user_by_username(
    username: str,
    db: Session,
    current_user: User
):
    user = db.query(User).filter(
        User.username == username
    ).first()
    return user

        

def get_user_by_email(email: str, db: Session, current_user: User):
    
    user = db.query(User).filter(User.email == email).first()
    return user
        


def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session,
    current_user: User
):
    
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user_update.full_name is not None:
        user.full_name = user_update.full_name

    if user_update.username is not None:
        user.username = user_update.username

    if user_update.bio is not None:
        user.bio = user_update.bio

    if user_update.is_private is not None:
        user.is_private = user_update.is_private

    if user_update.followers_count is not None:
        user.followers_count = user_update.followers_count

    if user_update.following_count is not None:
        user.following_count = user_update.following_count

    db.commit()
    db.refresh(user)

    return user


def delete_user(
    user_id: int,
    db: Session,
    current_user: User
):   
    user = db.query(User).filter(
        User.id == user_id
    ).first()
    db.delete(user)
    db.commit()
    return user
    
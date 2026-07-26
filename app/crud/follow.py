from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.model.user import User
from app.model.follow import Follow


def follow_user(db: Session, follower_id: int, followed_id: int):
    if follower_id == followed_id:
        raise HTTPException(status_code=400, detail="you cannot follow yourself")

    followed_user = db.query(User).filter(User.id == followed_id).first()
    if followed_user is None:
        raise HTTPException(status_code=404, detail="user not found")

    existing = db.query(Follow).filter(
        Follow.follower_id == follower_id,
        Follow.followed_id == followed_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="already following this user")

    follower_user = db.query(User).filter(User.id == follower_id).first()

    db.add(Follow(follower_id=follower_id, followed_id=followed_id))
    followed_user.followers_count = (followed_user.followers_count or 0) + 1
    follower_user.following_count = (follower_user.following_count or 0) + 1

    db.commit()
    return {"detail": "followed successfully"}


def unfollow_user(db: Session, follower_id: int, followed_id: int):
    follow_row = db.query(Follow).filter(
        Follow.follower_id == follower_id,
        Follow.followed_id == followed_id
    ).first()
    if follow_row is None:
        raise HTTPException(status_code=404, detail="you are not following this user")

    followed_user = db.query(User).filter(User.id == followed_id).first()
    follower_user = db.query(User).filter(User.id == follower_id).first()

    db.delete(follow_row)
    if followed_user and followed_user.followers_count > 0:
        followed_user.followers_count -= 1
    if follower_user and follower_user.following_count > 0:
        follower_user.following_count -= 1

    db.commit()
    return {"detail": "unfollowed successfully"}


def get_followers(db: Session, user_id: int):
    return (
        db.query(User)
        .join(Follow, Follow.follower_id == User.id)
        .filter(Follow.followed_id == user_id)
        .all()
    )


def get_following(db: Session, user_id: int):
    return (
        db.query(User)
        .join(Follow, Follow.followed_id == User.id)
        .filter(Follow.follower_id == user_id)
        .all()
    )
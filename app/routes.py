from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .schemas import UserCreate, UserResponse, UserUpdate, PostCreate, PostResponse, PostUpdate, login_data

from .database import get_db
from .models import User, Post
from .auth import hash_password, verify_password, create_access_token, get_current_user
from .email_service import send_signup_email
router = APIRouter()


@router.post("/create_user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
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

    return "user created successfully"


@router.get("/all_users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).all()
    return users


@router.get("/get_user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.get("/get_user_by_username")
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user


@router.patch("/update_profile/{user_id}", response_model=UserUpdate)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="user not found"
        )

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


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="user not found"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


@router.post("/posts", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)

):
    print(current_user)
    # Check if the user exists
    user = db.query(User).filter(User.id == post.user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Create the post
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


@router.get("/posts", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    posts = db.query(Post).all()
    return posts


@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):

    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post


@router.patch("/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db)
):

    post = db.query(Post).filter(Post.id == post_id).first()

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


@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db)
):

    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}


@router.post("/login")
def login_id(login_info: login_data, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_info.username).first()
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="user not found"
        )

    if not verify_password(login_info.password, user.password_hash):

        raise HTTPException(
            status_code=401,
            detail="invalid password"
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "username": str(user.username)
        }
    )

    return {
        "message": "login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

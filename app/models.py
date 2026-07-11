from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    bio = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)

    is_private = Column(Boolean, default=False) 

    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)

    posts = relationship("Post", back_populates="owner")
    



class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    caption = Column(String)
    image_url = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="posts") 
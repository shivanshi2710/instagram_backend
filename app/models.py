from sqlalchemy import Column, Integer, String, Float, Boolean
from .database import Base


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
    

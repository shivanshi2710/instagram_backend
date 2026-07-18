from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    caption = Column(String)
    image_url = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="posts")


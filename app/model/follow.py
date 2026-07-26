from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, DateTime, func
from app.database import Base
from sqlalchemy.orm import relationship

class Follow(Base):
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    followed_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("follower_id", "followed_id", name="uq_follower_followed"),
    )

    follower = relationship("User", foreign_keys=[follower_id])
    followed = relationship("User", foreign_keys=[followed_id])

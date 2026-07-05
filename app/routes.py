from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .schemas import  UserCreate 

from .database import get_db
from .models import User

router = APIRouter()

@router.post("/create_user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        full_name = user.full_name,
        username = user.username,
        password_hash = user.password  
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

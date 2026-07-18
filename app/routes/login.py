
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db

from ..schemas.login import LoginData

from ..crud import login as login_crud

from ..auth.password import verify_password
from ..auth.token import create_access_token

router = APIRouter(
    tags=["Authentication"]
)


@router.post("/login")
def login(
    login_info: LoginData,
    db: Session = Depends(get_db)
):

    user = login_crud.authenticate_user(
        db,
        login_info.username
    )

    if not verify_password(
        login_info.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "username": user.username
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }
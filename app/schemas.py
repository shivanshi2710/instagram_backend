from pydantic import BaseModel

class UserBase(BaseModel):
    full_name: str
    username: str
    bio: str | None = None
    is_private: bool = False

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    followers_count: int
    following_count: int

    model_config = {
        "from_attributes": True
    }

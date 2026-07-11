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
class UserUpdate(BaseModel):
    full_name: str | None = None
    username: str | None = None
    bio: str | None = None
    is_private: bool| None
    followers_count: int | None = None
    following_count: int | None = None
 

class PostCreate(BaseModel):
    content: str
    caption: str
    image_url: str | None = None
    user_id: int


class PostResponse(PostCreate):
    id: int

    model_config = {
        "from_attributes": True
    }


class PostUpdate(BaseModel):
    caption: str | None = None
    content: str | None = None
    image_url: str | None = None


class login_data(BaseModel):
    username: str
    password: str
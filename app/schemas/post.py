from pydantic import BaseModel
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

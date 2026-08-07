from fastapi import UploadFile, File
from pydantic import BaseModel
class PostCreate(BaseModel):
    content: str
    caption: str
    


class PostResponse(PostCreate):
    id: int
    image_url:str

    model_config = {
        "from_attributes": True
    }


class PostUpdate(BaseModel):
    caption: str | None = None
    content: str | None = None
    image_url: str | None = None




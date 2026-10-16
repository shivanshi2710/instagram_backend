
from app.schemas.post import PostResponse

# Cache posts by user ID
posts_cache = {
    "95": [

        {
            "id": 1,
            "title": "Post 1",
            "content": "Content 1"
        },
        {
            "id": 2,
            "title": "Post 2",
            "content": "Content 2"
        }
    ]
}


def dump_post(post):
    return PostResponse.model_validate(post).model_dump()

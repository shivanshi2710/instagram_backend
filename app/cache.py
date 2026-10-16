
from app.schemas.post import PostResponse

# Cache posts by user ID
posts_cache = {}


def dump_post(post):
    return PostResponse.model_validate(post).model_dump()

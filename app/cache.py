
import json
import os

import redis
from app.schemas.post import PostResponse

REDIS_URL = os.getenv(
    "REDIS_URL",
    "redis://localhost:6379/0"
)

redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True,
    socket_connect_timeout=2,
    socket_timeout=2,
)


def dump_post(post):
    return PostResponse.model_validate(post).model_dump()


def get_cached_posts(user_id: int):
    key = f"posts:user:{user_id}"

    try:
        cached = redis_client.get(key)

        if cached is None:
            return None

        return json.loads(cached)

    except (redis.RedisError, json.JSONDecodeError):
        return None


def set_cached_posts(user_id: int, posts: list):
    key = f"posts:user:{user_id}"

    try:
        redis_client.setex(
            key,
            60,
            json.dumps(posts)
        )
    except redis.RedisError:
        pass


def invalidate_posts_cache(user_id: int):
    key = f"posts:user:{user_id}"

    try:
        redis_client.delete(key)
    except redis.RedisError:
        pass


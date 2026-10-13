import json
import logging
import os
import time

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

POSTS_TTL = 60
USER_TTL = 60
USERS_ALL_TTL = 30
FOLLOW_TTL = 30


def posts_key(user_id: int) -> str:
    return f"posts:user:{user_id}"


def user_id_key(user_id: int) -> str:
    return f"user:id:{user_id}"


def user_username_key(username: str) -> str:
    return f"user:username:{username.lower()}"


def users_all_key() -> str:
    return "users:all"


def followers_key(user_id: int) -> str:
    return f"follow:followers:{user_id}"


def following_key(user_id: int) -> str:
    return f"follow:following:{user_id}"


class Cache:
    def __init__(self):
        self._redis = None
        self._memory = {}
        url = os.getenv("REDIS_URL")
        if not url:
            logger.info("REDIS_URL not set; using in-memory cache")
            return
        try:
            import redis

            client = redis.Redis.from_url(url, decode_responses=True)
            client.ping()
            self._redis = client
            logger.info("Connected to Redis cache")
        except Exception as exc:
            logger.warning("Redis unavailable, using in-memory cache: %s", exc)

    def get_json(self, key: str):
        if self._redis is not None:
            try:
                raw = self._redis.get(key)
                return json.loads(raw) if raw else None
            except Exception as exc:
                logger.warning("Redis get failed for %s: %s", key, exc)

        item = self._memory.get(key)
        if item is None:
            return None
        expires_at, raw = item
        if time.time() > expires_at:
            self._memory.pop(key, None)
            return None
        return json.loads(raw)

    def set_json(self, key: str, value, ttl: int):
        raw = json.dumps(value)
        if self._redis is not None:
            try:
                self._redis.setex(key, ttl, raw)
                return
            except Exception as exc:
                logger.warning("Redis set failed for %s: %s", key, exc)

        self._memory[key] = (time.time() + ttl, raw)

    def delete(self, *keys: str):
        keys = [key for key in keys if key]
        if not keys:
            return
        if self._redis is not None:
            try:
                self._redis.delete(*keys)
            except Exception as exc:
                logger.warning("Redis delete failed: %s", exc)
        for key in keys:
            self._memory.pop(key, None)


cache = Cache()


def dump_post(post) -> dict:
    from app.schemas.post import PostResponse

    return PostResponse.model_validate(post).model_dump()


def dump_user(user) -> dict:
    from app.schemas.user import UserResponse

    return UserResponse.model_validate(user).model_dump()


def invalidate_posts(user_id: int):
    cache.delete(posts_key(user_id))


def invalidate_user(user):
    if user is None:
        return
    cache.delete(
        user_id_key(user.id),
        user_username_key(user.username),
        users_all_key(),
    )


def invalidate_follow(follower, followed):
    keys = [users_all_key()]
    if follower is not None:
        keys.extend(
            [
                following_key(follower.id),
                user_id_key(follower.id),
                user_username_key(follower.username),
            ]
        )
    if followed is not None:
        keys.extend(
            [
                followers_key(followed.id),
                user_id_key(followed.id),
                user_username_key(followed.username),
            ]
        )
    cache.delete(*keys)

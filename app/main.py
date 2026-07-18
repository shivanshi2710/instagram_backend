from fastapi import FastAPI

from .database import Base, engine

# Import all models
from app import model

# Import routers
from .routes import user, posts, login

app = FastAPI(
    title="Instagram Backend API"
)

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(posts.router)
app.include_router(login.router)
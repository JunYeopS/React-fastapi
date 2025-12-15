from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as users_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware 
app.add_middleware(
    SessionMiddleware,
    secret_key="dev-secret-key"  # TODO: .env로 이동
)

# Routers
app.include_router(users_router, prefix="/users", tags=["users"])

@app.get("/")
def ping():
    return {"message": "Hello world!"}
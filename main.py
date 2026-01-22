from fastapi import FastAPI
from chromium import *
app = FastAPI()

@app.get("/")
async def Welcome():
    return {"message": "Hello from FastAPI!"}

@app.get("/watchlist/{user}")
async def watchlist(user: str):
    data = await get_watchlist(user)
    return data["watchlist"]
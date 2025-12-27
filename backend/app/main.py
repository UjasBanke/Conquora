import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent))

from fastapi import FastAPI
from api.game import router as game_router

app = FastAPI(title="Conquora")

app.include_router(game_router, prefix="/game")


@app.get("/health")
def health_check():
    return {"status": "ok"}

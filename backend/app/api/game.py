from fastapi import APIRouter, HTTPException
from models.game_state import GameState
from core.game_logic import capture_tile

router = APIRouter()

game = GameState()


@router.get("/state")
def get_state():
    return {
        "current_turn": game.current_turn,
        "is_over": game.is_over,
        "winner": game.winner,
        "players": {
            pid: {"score": p.score}
            for pid, p in game.players.items()
        },
        "grid": [
            [
                tile.owner for tile in row
            ]
            for row in game.grid.tiles
        ],
    }


@router.post("/capture")
def capture(player_id: str, x: int, y: int):
    success = capture_tile(game, player_id, x, y)

    if not success:
        raise HTTPException(status_code=400, detail="Invalid move")

    return {"success": True}

from models.game_state import GameState
from models.tile import TileOwner


def capture_tile(game: GameState, player_id: str, x: int, y: int) -> bool:
    if game.is_over:
        return False

    if game.current_turn != player_id:
        return False

    tile = game.grid.get_tile(x, y)

    if tile.owner != TileOwner.NONE:
        return False

    tile.owner = TileOwner(player_id.upper())
    game.current_turn = (
        "player_2" if player_id == "player_1" else "player_1"
    )

    return True

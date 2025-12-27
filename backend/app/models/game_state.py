from .grid import Grid
from .player import Player
from .tile import TileOwner


class GameState:
    TARGET_SCORE = 100
    POINTS_PER_TILE = 1

    def __init__(self):
        self.grid = Grid()
        self.players = {
            "player_1": Player("player_1"),
            "player_2": Player("player_2"),
        }
        self.current_turn = "player_1"
        self.is_over = False
        self.winner = None

    def apply_scoring(self):
        counts = {
            TileOwner.PLAYER_1: 0,
            TileOwner.PLAYER_2: 0,
        }

        for row in self.grid.tiles:
            for tile in row:
                if tile.owner in counts:
                    counts[tile.owner] += 1

        self.players["player_1"].score += (
            counts[TileOwner.PLAYER_1] * self.POINTS_PER_TILE
        )
        self.players["player_2"].score += (
            counts[TileOwner.PLAYER_2] * self.POINTS_PER_TILE
        )

    def check_winner(self):
        for player in self.players.values():
            if player.score >= self.TARGET_SCORE:
                self.is_over = True
                self.winner = player.id
                return

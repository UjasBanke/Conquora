from .grid import Grid
from .player import Player


class GameState:
    TARGET_SCORE = 100

    def __init__(self):
        self.grid = Grid()
        self.players = {
            "player_1": Player("player_1"),
            "player_2": Player("player_2"),
        }
        self.current_turn = "player_1"
        self.is_over = False

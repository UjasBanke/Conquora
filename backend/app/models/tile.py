from enum import Enum


class TileOwner(str, Enum):
    NONE = "none"
    PLAYER_1 = "player_1"
    PLAYER_2 = "player_2"


class Tile:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
        self.owner = TileOwner.NONE

from .tile import Tile


class Grid:
    SIZE = 10

    def __init__(self):
        self.tiles = [
            [Tile(x, y) for x in range(self.SIZE)]
            for y in range(self.SIZE)
        ]

    def get_tile(self, x: int, y: int) -> Tile:
        return self.tiles[y][x]

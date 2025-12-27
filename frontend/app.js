const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const turnEl = document.getElementById("turn");
const scoresEl = document.getElementById("scores");
const statusEl = document.getElementById("status");

const GRID_SIZE = 10;
const TILE_SIZE = canvas.width / GRID_SIZE;

const STATE_URL = "http://127.0.0.1:8000/game/state";
const CAPTURE_URL = "http://127.0.0.1:8000/game/capture";

let gameState = null;
let hoverTile = null;

// TEMP: manual player identity
const PLAYER_ID = "player_1";

async function fetchGameState() {
    const res = await fetch(STATE_URL);
    return await res.json();
}

async function captureTile(x, y) {
    const params = new URLSearchParams({
        player_id: PLAYER_ID,
        x: x,
        y: y,
    });

    const res = await fetch(`${CAPTURE_URL}?${params}`, {
        method: "POST",
    });

    return res.ok;
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const owner = grid[y][x];
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            ctx.fillStyle = "#020617";
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

            ctx.strokeStyle = "#1e293b";
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

            if (owner !== "none") {
                const gradient = ctx.createLinearGradient(
                    px,
                    py,
                    px,
                    py + TILE_SIZE
                );

                if (owner === "player_1") {
                    gradient.addColorStop(0, "#60a5fa");
                    gradient.addColorStop(1, "#2563eb");
                } else {
                    gradient.addColorStop(0, "#f87171");
                    gradient.addColorStop(1, "#b91c1c");
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    px + 4,
                    py + 4,
                    TILE_SIZE - 8,
                    TILE_SIZE - 8
                );
            }
        }
    }
}

function drawHover() {
    if (!hoverTile || !gameState) return;

    const { x, y } = hoverTile;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        x * TILE_SIZE + 2,
        y * TILE_SIZE + 2,
        TILE_SIZE - 4,
        TILE_SIZE - 4
    );
}

function updateUI(state) {
    turnEl.textContent = `Turn: ${state.current_turn}`;
    scoresEl.textContent =
        `Player 1: ${state.players.player_1.score} | ` +
        `Player 2: ${state.players.player_2.score}`;

    statusEl.textContent = state.is_over
        ? `Winner: ${state.winner}`
        : "";
}

async function render() {
    gameState = await fetchGameState();
    drawGrid(gameState.grid);
    drawHover();
    updateUI(gameState);
}

canvas.addEventListener("click", async (e) => {
    if (!gameState || gameState.is_over) return;
    if (gameState.current_turn !== PLAYER_ID) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    const success = await captureTile(x, y);
    if (success) {
        render();
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!gameState) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    hoverTile = { x, y };
    drawGrid(gameState.grid);
    drawHover();
});

render();

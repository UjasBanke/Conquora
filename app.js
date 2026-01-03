const landing = document.getElementById("landing-screen");
const setup = document.getElementById("setup-screen");
const game = document.getElementById("game-screen");

const playBtn = document.getElementById("play-btn");
const startBtn = document.getElementById("start-btn");

const p1Input = document.getElementById("player1-name");
const p2Input = document.getElementById("player2-name");

const p1NameEl = document.getElementById("p1-name");
const p2NameEl = document.getElementById("p2-name");
const p1ScoreEl = document.getElementById("p1-score");
const p2ScoreEl = document.getElementById("p2-score");
const turnDisplay = document.getElementById("turn-display");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

playBtn.onclick = () => {
    landing.classList.add("hidden");
    setup.classList.remove("hidden");
};

startBtn.onclick = () => {
    p1NameEl.textContent = p1Input.value || "Player 1";
    p2NameEl.textContent = p2Input.value || "Player 2";
    setup.classList.add("hidden");
    game.classList.remove("hidden");
    resetGame();
    updateUI();
    render();
};

const DOTS = 9;
const PAD = 40;
const GAP = (canvas.width - PAD * 2) / (DOTS - 1);

let current;
let scores;
let lines;
let boxes;
let gameOver = false;

function resetGame() {
    current = "player_1";
    scores = { player_1: 0, player_2: 0 };
    lines = new Map();
    boxes = new Map();
    gameOver = false;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoxes();
    drawLines();
    drawDots();
    if (gameOver) drawGameOver();
}

function drawDots() {
    ctx.fillStyle = "#cbd5f5";
    for (let r = 0; r < DOTS; r++)
        for (let c = 0; c < DOTS; c++) {
            ctx.beginPath();
            ctx.arc(PAD + c * GAP, PAD + r * GAP, 4, 0, Math.PI * 2);
            ctx.fill();
        }
}

function drawLines() {
    ctx.lineCap = "round";

    for (let r = 0; r < DOTS; r++)
        for (let c = 0; c < DOTS - 1; c++) {
            const key = `H-${r}-${c}`;
            setLineStyle(key);
            ctx.beginPath();
            ctx.moveTo(PAD + c * GAP, PAD + r * GAP);
            ctx.lineTo(PAD + (c + 1) * GAP, PAD + r * GAP);
            ctx.stroke();
        }

    for (let c = 0; c < DOTS; c++)
        for (let r = 0; r < DOTS - 1; r++) {
            const key = `V-${r}-${c}`;
            setLineStyle(key);
            ctx.beginPath();
            ctx.moveTo(PAD + c * GAP, PAD + r * GAP);
            ctx.lineTo(PAD + c * GAP, PAD + (r + 1) * GAP);
            ctx.stroke();
        }
}

function setLineStyle(key) {
    const owner = lines.get(key);
    if (owner === "player_1") {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 6;
    } else if (owner === "player_2") {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 6;
    } else {
        ctx.strokeStyle = "rgba(148,163,184,0.35)";
        ctx.lineWidth = 4;
    }
}

function drawBoxes() {
    for (const [k, o] of boxes) {
        const [, r, c] = k.split("-").map(Number);
        ctx.fillStyle = o === "player_1" ? "#3b82f6" : "#ef4444";
        ctx.fillRect(PAD + c * GAP + 4, PAD + r * GAP + 4, GAP - 8, GAP - 8);
    }
}

canvas.onclick = e => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const line = findLine(x, y);
    if (!line) return;

    const key = `${line.t}-${line.r}-${line.c}`;
    if (lines.has(key)) return;

    lines.set(key, current);
    const madeBox = checkBoxes(line);

    if (!madeBox)
        current = current === "player_1" ? "player_2" : "player_1";

    updateUI();
    checkGameOver();
    render();
};

function findLine(x, y) {
    for (let r = 0; r < DOTS; r++)
        for (let c = 0; c < DOTS - 1; c++)
            if (
                Math.abs(y - (PAD + r * GAP)) < 8 &&
                x >= PAD + c * GAP &&
                x <= PAD + (c + 1) * GAP
            )
                return { t: "H", r, c };

    for (let c = 0; c < DOTS; c++)
        for (let r = 0; r < DOTS - 1; r++)
            if (
                Math.abs(x - (PAD + c * GAP)) < 8 &&
                y >= PAD + r * GAP &&
                y <= PAD + (r + 1) * GAP
            )
                return { t: "V", r, c };
}

function checkBoxes(line) {
    let made = false;
    const targets =
        line.t === "H"
            ? [[line.r - 1, line.c], [line.r, line.c]]
            : [[line.r, line.c - 1], [line.r, line.c]];

    for (const [r, c] of targets) {
        if (r < 0 || c < 0 || r >= DOTS - 1 || c >= DOTS - 1) continue;
        if (
            lines.has(`H-${r}-${c}`) &&
            lines.has(`H-${r + 1}-${c}`) &&
            lines.has(`V-${r}-${c}`) &&
            lines.has(`V-${r}-${c + 1}`)
        ) {
            const key = `B-${r}-${c}`;
            if (!boxes.has(key)) {
                boxes.set(key, current);
                scores[current]++;
                made = true;
            }
        }
    }
    return made;
}

function checkGameOver() {
    if (boxes.size === (DOTS - 1) * (DOTS - 1)) {
        gameOver = true;
        turnDisplay.textContent = "GAME OVER";
    }
}

function drawGameOver() {
    const winner =
        scores.player_1 > scores.player_2
            ? p1NameEl.textContent
            : scores.player_2 > scores.player_1
            ? p2NameEl.textContent
            : "DRAW";

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
        winner === "DRAW" ? "DRAW" : `${winner} WINS`,
        canvas.width / 2,
        canvas.height / 2 - 20
    );

    ctx.font = "16px system-ui";
    ctx.fillText(
        "PLAY AGAIN",
        canvas.width / 2,
        canvas.height / 2 + 30
    );

    canvas.style.cursor = "pointer";
}

canvas.addEventListener("mousemove", e => {
    if (!gameOver) return;
    canvas.style.cursor = "pointer";
});

canvas.addEventListener("click", e => {
    if (!gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;

    if (y > canvas.height / 2 + 10 && y < canvas.height / 2 + 50) {
        game.classList.add("hidden");
        setup.classList.remove("hidden");
    }
});

function updateUI() {
    turnDisplay.textContent =
        "TURN: " +
        (current === "player_1"
            ? p1NameEl.textContent
            : p2NameEl.textContent);
    p1ScoreEl.textContent = scores.player_1;
    p2ScoreEl.textContent = scores.player_2;
}

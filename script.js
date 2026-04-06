const state = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  gameOver: false,
  winner: null,
  winningLine: null,
};

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const statusEl = document.getElementById("status");
const boardEl = document.getElementById("board");
const cellEls = Array.from(document.querySelectorAll(".cell"));
const resetBtn = document.getElementById("reset");

function initializeGame() {
  renderBoard();
  renderStatus();
}

function renderBoard() {
  state.board.forEach((value, index) => {
    const cell = cellEls[index];
    cell.textContent = value ?? "";
    cell.disabled = state.gameOver || value !== null;
  });
}

function renderStatus() {
  if (state.winner) {
    statusEl.textContent = `Player ${state.winner} wins!`;
    return;
  }

  if (state.gameOver) {
    statusEl.textContent = "It's a draw!";
    return;
  }

  statusEl.textContent = `Player ${state.currentPlayer}'s turn`;
}

function makeMove(index) {
  if (state.gameOver || state.board[index] !== null) {
    return;
  }

  state.board[index] = state.currentPlayer;

  const winResult = checkWin(state.board);
  if (winResult) {
    state.winner = winResult.winner;
    state.winningLine = winResult.line;
    state.gameOver = true;
    return;
  }

  if (checkDraw(state.board)) {
    state.gameOver = true;
    return;
  }

  state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
}

function resetGame() {
  state.board = Array(9).fill(null);
  state.currentPlayer = "X";
  state.gameOver = false;
  state.winner = null;
  state.winningLine = null;
}

function checkWin(board) {
  for (const line of winningCombos) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function checkDraw(board) {
  return board.every((cell) => cell !== null) && !checkWin(board);
}

cellEls.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    const index = Number(event.currentTarget.dataset.index);
    makeMove(index);
    renderBoard();
    renderStatus();
  });
});

resetBtn.addEventListener("click", () => {
  resetGame();
  renderBoard();
  renderStatus();
});

const RUN_LOGIC_TESTS = false;
if (RUN_LOGIC_TESTS) {
  console.log("Win check", checkWin(["X", "X", "X", null, null, null, null, null, null]));
  console.log("Diagonal win", checkWin(["O", null, null, null, "O", null, null, null, "O"]));
  console.log("Draw check", checkDraw(["X", "O", "X", "X", "O", "O", "O", "X", "X"]));
}

initializeGame();

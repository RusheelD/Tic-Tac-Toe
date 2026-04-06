# Tic Tac Toe Contracts

## DOM Structure
- `#game` : container element for the app.
- `#status` : status text element showing current player, winner, or draw.
- `#board` : board container with 9 child elements.
- `.cell` : each board cell element.
- `data-index` : integer 0-8 attribute on each `.cell`, mapping to the board array index.
- `.cell.is-winning` : applied to cells that are part of the winning line (for styling).
- `#reset` : button to reset the game.

## Game State Model (script.js)
- `board: Array<"X" | "O" | null>` length 9, index maps to `data-index`.
- `currentPlayer: "X" | "O"`.
- `gameOver: boolean`.
- `winner: "X" | "O" | null`.
- `winningLine: number[] | null` (indexes of winning cells).

## Function Signatures (script.js)
- `initializeGame(): void` — sets initial state and triggers first render.
- `renderBoard(): void` — updates cell text from `board`.
- `renderStatus(): void` — updates `#status` for turn/win/draw.
- `makeMove(index: number): void` — validates move, updates state, checks win/draw, toggles player.
- `resetGame(): void` — clears state to initial.
- `checkWin(board: Array<"X" | "O" | null>): { winner: "X" | "O"; line: number[] } | null`.
- `checkDraw(board: Array<"X" | "O" | null>): boolean`.

## Status Message Contract
- Ongoing game: `"Player X's turn"` or `"Player O's turn"`.
- Win: `"Player X wins!"` or `"Player O wins!"`.
- Draw: `"It's a draw!"`.

## Event Wiring
- `.cell` click calls `makeMove(index)` then `renderBoard()` + `renderStatus()`.
- `#reset` click calls `resetGame()` then `renderBoard()` + `renderStatus()`.

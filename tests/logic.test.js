const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.join(__dirname, '..', 'script.js');
const scriptCode = fs.readFileSync(scriptPath, 'utf8');

const createElement = () => ({
  textContent: '',
  dataset: {},
  classList: { add() {}, remove() {} },
  addEventListener() {},
  querySelectorAll() {
    return [];
  },
});

const cells = Array.from({ length: 9 }, (_, index) => ({
  textContent: '',
  dataset: { index: String(index) },
  classList: { add() {}, remove() {} },
  addEventListener() {},
}));

const boardElement = createElement();
boardElement.querySelectorAll = () => cells;

const statusElement = createElement();
const resetButton = createElement();
const gameElement = createElement();

const documentStub = {
  getElementById: (id) => {
    if (id === 'board') return boardElement;
    if (id === 'status') return statusElement;
    if (id === 'reset') return resetButton;
    if (id === 'game') return gameElement;
    return null;
  },
  querySelectorAll: (selector) => {
    if (selector === '.cell') return cells;
    return [];
  },
  addEventListener: (event, handler) => {
    if (event === 'DOMContentLoaded') {
      handler();
    }
  },
};

const context = {
  document: documentStub,
  window: { document: documentStub },
  console,
};

vm.createContext(context);
vm.runInContext(scriptCode, context);

const { checkWin, checkDraw } = context;

assert.strictEqual(typeof checkWin, 'function', 'checkWin should be a function');
assert.strictEqual(typeof checkDraw, 'function', 'checkDraw should be a function');

const emptyBoard = Array(9).fill(null);
assert.strictEqual(checkWin(emptyBoard), null, 'empty board has no winner');
assert.strictEqual(checkDraw(emptyBoard), false, 'empty board is not a draw');

const rowWinBoard = ['X', 'X', 'X', null, 'O', null, null, 'O', null];
assert.deepStrictEqual(checkWin(rowWinBoard), { winner: 'X', line: [0, 1, 2] }, 'detects top row win');
assert.strictEqual(checkDraw(rowWinBoard), false, 'row win is not a draw');

const colWinBoard = ['O', 'X', null, 'O', 'X', null, 'O', null, 'X'];
assert.deepStrictEqual(checkWin(colWinBoard), { winner: 'O', line: [0, 3, 6] }, 'detects left column win');

const diagWinBoard = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
assert.deepStrictEqual(checkWin(diagWinBoard), { winner: 'X', line: [0, 4, 8] }, 'detects diagonal win');

const drawBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
assert.strictEqual(checkWin(drawBoard), null, 'draw board has no winner');
assert.strictEqual(checkDraw(drawBoard), true, 'full board without winner is a draw');

console.log('Logic tests passed.');

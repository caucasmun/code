/**
 * Чистая игровая логика игры «Крестики-нолики».
 */

/** Размер поля. */
export const BOARD_SIZE = 3;

/** Выигрышные комбинации: строки, столбцы и диагонали. */
export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Проверяет, есть ли победитель, и возвращает выигрышную линию.
 * @returns {{ winner: 'X'|'O'|null, line: number[]|null }}
 */
export function checkWinner(board) {
  for (let i = 0; i < WINNING_LINES.length; i += 1) {
    const [a, b, c] = WINNING_LINES[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: WINNING_LINES[i] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Проверяет, остались ли свободные клетки.
 */
export function hasEmptyCell(board) {
  return board.some((cell) => cell === null);
}

/** Возвращает список индексов свободных клеток. */
export function getEmptyCells(board) {
  const cells = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === null) cells.push(i);
  }
  return cells;
}

/** Создаёт пустое поле. */
export function createEmptyBoard() {
  return Array(BOARD_SIZE * BOARD_SIZE).fill(null);
}

/**
 * Выбирает ход компьютера.
 *
 * Используется простая стратегия: сначала проверяется, может ли
 * компьютер выиграть сейчас, затем — может ли игрок выиграть сейчас,
 * и только потом выбирается случайная свободная клетка.
 * Это упрощённая эвристика, а не «продвинутый искусственный интеллект».
 */
export function chooseComputerMove(board, computerMark = 'O') {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;

  const playerMark = computerMark === 'O' ? 'X' : 'O';

  // 1. Выигрышный ход компьютера.
  for (const cell of emptyCells) {
    const test = [...board];
    test[cell] = computerMark;
    if (checkWinner(test).winner === computerMark) return cell;
  }

  // 2. Блокировка хода игрока.
  for (const cell of emptyCells) {
    const test = [...board];
    test[cell] = playerMark;
    if (checkWinner(test).winner === playerMark) return cell;
  }

  // 3. Случайный допустимый ход.
  const index = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[index];
}

/**
 * Выполняет ход игрока и возвращает новое состояние.
 */
export function applyPlayerMove(state, cellIndex) {
  if (state.status !== 'playing') return state;
  if (cellIndex < 0 || cellIndex >= state.board.length) return state;
  if (state.board[cellIndex] !== null) return state;

  const board = [...state.board];
  board[cellIndex] = state.playerMark;

  const { winner, line } = checkWinner(board);
  if (winner) {
    const newScore = { ...state.score };
    if (winner === 'X') newScore.X += 1;
    if (winner === 'O') newScore.O += 1;
    return { ...state, board, status: 'won', winner, winningLine: line, score: newScore };
  }

  if (!hasEmptyCell(board)) {
    const newScore = { ...state.score, draws: state.score.draws + 1 };
    return { ...state, board, status: 'draw', winner: null, winningLine: null, score: newScore };
  }

  return { ...state, board, status: 'playing', winner: null, winningLine: null };
}

/**
 * Выполняет ход компьютера и возвращает новое состояние.
 */
export function applyComputerMove(state) {
  if (state.status !== 'playing') return state;
  if (state.mode !== 'computer') return state;

  const cell = chooseComputerMove(state.board, state.computerMark);
  if (cell === null) return state;

  const board = [...state.board];
  board[cell] = state.computerMark;

  const { winner, line } = checkWinner(board);
  if (winner) {
    const newScore = { ...state.score };
    if (winner === 'X') newScore.X += 1;
    if (winner === 'O') newScore.O += 1;
    return { ...state, board, status: 'won', winner, winningLine: line, score: newScore };
  }

  if (!hasEmptyCell(board)) {
    const newScore = { ...state.score, draws: state.score.draws + 1 };
    return { ...state, board, status: 'draw', winner: null, winningLine: null, score: newScore };
  }

  return { ...state, board, status: 'playing', winner: null, winningLine: null };
}

/**
 * Создаёт начальное состояние игры.
 * @param {'computer'|'twoPlayers'} mode Режим игры.
 */
export function createInitialTicTacToeState(mode = 'computer') {
  return {
    board: createEmptyBoard(),
    mode,
    playerMark: 'X',
    computerMark: 'O',
    currentPlayer: 'X',
    status: 'playing', // playing | won | draw
    winner: null,
    winningLine: null,
    score: { X: 0, O: 0, draws: 0 },
  };
}

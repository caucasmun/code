/**
 * Чистая игровая логика игры «Камень, ножницы, бумага».
 * Функции не зависят от React — их можно покрыть тестами.
 */

/** Возможные ходы. */
export const MOVES = ['rock', 'scissors', 'paper'];

/** Русские названия ходов. */
export const MOVE_LABELS = {
  rock: 'Камень',
  scissors: 'Ножницы',
  paper: 'Бумага',
};

/** Результат раунда. */
export const ROUND_RESULT = {
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw',
};

/** Сколько побед нужно, чтобы выиграть матч. */
export const MATCH_TARGET_WINS = 3;

/** Сколько последних раундов хранить в истории матча. */
export const HISTORY_LIMIT = 5;

/** Победитель матча. */
export const MATCH_WINNER = {
  PLAYER: 'player',
  COMPUTER: 'computer',
};

/**
 * Правила победы: камень бьёт ножницы, ножницы бьют бумагу, бумага бьёт камень.
 * Ключ — ход игрока, значение — ход, который этот ход побеждает.
 */
const BEATS = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
};

/**
 * Определяет результат раунда.
 * @returns {'win' | 'lose' | 'draw'}
 */
export function determineResult(playerMove, computerMove) {
  if (playerMove === computerMove) return ROUND_RESULT.DRAW;
  if (BEATS[playerMove] === computerMove) return ROUND_RESULT.WIN;
  return ROUND_RESULT.LOSE;
}

/**
 * Выбирает случайный ход компьютера из массива вариантов.
 */
export function getRandomMove(moves = MOVES) {
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}

/** Создаёт пустой счёт. */
export function createEmptyScore() {
  return { wins: 0, losses: 0, draws: 0, bestStreak: 0, currentStreak: 0 };
}

/**
 * Добавляет результат раунда к счёту и возвращает новое состояние.
 * Мутирование исходного объекта не выполняется.
 */
export function applyRoundToScore(score, result) {
  const next = { ...score };

  if (result === ROUND_RESULT.WIN) {
    next.wins += 1;
    next.currentStreak += 1;
    if (next.currentStreak > next.bestStreak) next.bestStreak = next.currentStreak;
  } else {
    next.currentStreak = 0;
    if (result === ROUND_RESULT.LOSE) next.losses += 1;
    if (result === ROUND_RESULT.DRAW) next.draws += 1;
  }

  return next;
}

/**
 * Создаёт пустое состояние матча.
 * Матч играется до победы в MATCH_TARGET_WINS раундов.
 */
export function createEmptyMatch() {
  return {
    playerWins: 0,
    computerWins: 0,
    draws: 0,
    rounds: 0,
    winner: null,
    history: [],
  };
}

/** Матч закончен, если кто-то уже набрал нужное число побед. */
export function isMatchFinished(match) {
  return Boolean(match.winner);
}

/**
 * Определяет победителя матча по счёту.
 * @returns {'player' | 'computer' | null}
 */
export function getMatchWinner(playerWins, computerWins) {
  if (playerWins >= MATCH_TARGET_WINS) return MATCH_WINNER.PLAYER;
  if (computerWins >= MATCH_TARGET_WINS) return MATCH_WINNER.COMPUTER;
  return null;
}

/**
 * Играет один раунд матча и возвращает новое состояние.
 * Исходный объект не мутируется.
 *
 * @param {object} match Текущее состояние матча.
 * @param {string} playerMove Ход игрока.
 * @param {string} computerMove Ход компьютера.
 * @returns {object} Новое состояние матча.
 */
export function playMatchRound(match, playerMove, computerMove) {
  // Матч уже закончен — новые раунды не играются.
  if (isMatchFinished(match)) return match;

  const result = determineResult(playerMove, computerMove);

  const next = {
    ...match,
    playerWins: match.playerWins,
    computerWins: match.computerWins,
    draws: match.draws,
    rounds: match.rounds + 1,
    winner: match.winner,
    history: match.history,
  };

  if (result === ROUND_RESULT.WIN) next.playerWins += 1;
  else if (result === ROUND_RESULT.LOSE) next.computerWins += 1;
  else next.draws += 1;

  // История ограничена: самые старые раунды исчезают.
  next.history = [
    ...match.history,
    { round: match.rounds + 1, playerMove, computerMove, result },
  ].slice(-HISTORY_LIMIT);

  // Победа в матче фиксируется один раз — дальше раунды не идут.
  if (!next.winner) {
    next.winner = getMatchWinner(next.playerWins, next.computerWins);
  }

  return next;
}

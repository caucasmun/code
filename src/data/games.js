import { guessNumberGame } from './games/guessNumber';
import { rockPaperScissorsGame } from './games/rockPaperScissors';
import { hangmanGame } from './games/hangman';
import { ticTacToeGame } from './games/ticTacToe';
import { snakeGame } from './games/snake';

/**
 * Общий каталог игр.
 * Каталог, главная страница и страницы игры строятся из этих данных —
 * дублировать карточки вручную не нужно.
 */
export const games = [
  guessNumberGame,
  rockPaperScissorsGame,
  hangmanGame,
  ticTacToeGame,
  snakeGame,
];

/** Общее количество игр в проекте — используется для расчёта процента прогресса. */
export const TOTAL_GAMES = games.length;

/** Находит игру по её адресному идентификатору (slug). */
export function getGameBySlug(slug) {
  return games.find((game) => game.slug === slug) || null;
}

/**
 * Считает общее количество практических заданий во всех играх.
 * Используется для расчёта процента выполненных заданий.
 */
export const TOTAL_TASKS = games.reduce(
  (total, game) => total + (Array.isArray(game.tasks) ? game.tasks.length : 0),
  0,
);

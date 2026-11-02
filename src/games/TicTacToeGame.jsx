import { useState } from 'react';
import {
  BOARD_SIZE,
  createInitialTicTacToeState,
  applyPlayerMove,
  applyComputerMove,
} from '../utils/gameLogic/ticTacToeLogic';

/** Тексты статуса игры. */
const STATUS_MESSAGES = {
  won: 'Победа! Вы собрали линию.',
  draw: 'Ничья — поле заполнено.',
  lost: 'Компьютер победил. Попробуйте ещё раз!',
};

/**
 * Игра «Крестики-нолики» против компьютера.
 *
 * Компьютер ходит сразу после хода игрока, поэтому логике не нужно
 * ждать отдельного события «смена игрока».
 */
export default function TicTacToeGame({ onWin, onScore, onLose, onGameEnd }) {
  const [state, setState] = useState(() => createInitialTicTacToeState('computer'));

  const handleCellClick = (index) => {
    if (state.status !== 'playing') return;

    const afterPlayer = applyPlayerMove(state, index);
    if (afterPlayer === state) return;

    // Компьютер отвечает, только если игра ещё не закончилась.
    const next = afterPlayer.status === 'playing' ? applyComputerMove(afterPlayer) : afterPlayer;
    setState(next);

    if (next.status === 'won') {
      // Вызываем onWin только если победил игрок (X)
      if (next.winner === 'X') {
        const score = next.score.X + 1;
        onWin?.(score);
        onScore?.(score);
        onGameEnd?.('won');
      }
      // Если победил компьютер (O), onWin НЕ вызывается.
      // Вызываем onLose и onGameEnd со статусом 'lost'.
      else if (next.winner === 'O') {
        onLose?.();
        onGameEnd?.('lost');
      }
    } else if (next.status === 'draw') {
      onGameEnd?.('draw');
    }
  };

  const handleRestart = () => {
    setState(createInitialTicTacToeState('computer'));
  };

  const isFinished = state.status !== 'playing';

  // Цвет alert зависит от того, кто именно победил.
  const isPlayerWin = state.status === 'won' && state.winner === 'X';
  const isComputerWin = state.status === 'won' && state.winner === 'O';

  const alertClass = isPlayerWin
    ? 'alert--success'
    : isComputerWin
      ? 'alert--error'
      : state.status === 'draw'
        ? 'alert--info'
        : '';

  return (
    <div className="game game--tic-tac-toe">
      <div className="game__panel">
        {isFinished ? (
          <p className={`alert ${alertClass}`} role="status">
            {state.status === 'won'
              ? state.winner === 'X'
                ? 'Победа! Вы собрали линию.'
                : 'Компьютер собрал линию. Вы проиграли.'
              : STATUS_MESSAGES[state.status]}
          </p>
        ) : (
          <p className="game__hint-text">
            Вы играете за <strong>X</strong>, компьютер — за <strong>O</strong>.
          </p>
        )}

        <div className="ttt__board" role="grid" aria-label="Игровое поле">
          {state.board.map((cell, index) => {
            const isWinning =
              state.winningLine && state.winningLine.includes(index);

            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                className={`ttt__cell ${isWinning ? 'ttt__cell--winning' : ''}`.trim()}
                onClick={() => handleCellClick(index)}
                disabled={isFinished || cell !== null}
                aria-label={`Клетка ${index + 1}${cell ? `, ${cell}` : ', пусто'}`}
              >
                {cell || ''}
              </button>
            );
          })}
        </div>

        <div className="ttt__score">
          <span>
            Победы X: <strong>{state.score.X}</strong>
          </span>
          <span>
            Победы O: <strong>{state.score.O}</strong>
          </span>
          <span>
            Ничьи: <strong>{state.score.draws}</strong>
          </span>
        </div>

        <button type="button" className="button button--ghost" onClick={handleRestart}>
          Новая игра
        </button>
      </div>
    </div>
  );
}

/** Размер поля используется в разметке и в тестах. */
export { BOARD_SIZE };

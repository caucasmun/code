import { useEffect, useRef, useState } from 'react';
import {
  DIRECTIONS,
  createInitialSnakeState,
  stepSnake,
  isOppositeDirection,
  getRandomFreeCell,
} from '../utils/gameLogic/snakeLogic';

/** Размер игрового поля в клетках. */
const COLS = 20;
const ROWS = 20;
/** Задержка между шагами змейки в миллисекундах. */
const TICK_MS = 130;

/** Подписи направлений для экранных кнопок. */
const DIRECTION_LABELS = {
  up: 'Вверх',
  down: 'Вниз',
  left: 'Влево',
  right: 'Вправо',
};

/** Создаёт начальное состояние с уже расставленной едой. */
function createStartState() {
  const initial = createInitialSnakeState(COLS, ROWS);
  return { ...initial, food: getRandomFreeCell(COLS, ROWS, initial.snake) };
}

/**
 * Игра «Змейка».
 *
 * Поле рисуется сеткой элементов: так не нужен Canvas,
 * а логика движения остаётся в utils/gameLogic/snakeLogic.js.
 */
export default function SnakeGame({ onWin, onScore }) {
  const [state, setState] = useState(createStartState);

  // Актуальное состояние читаем внутри игрового таймера,
  // чтобы не пересоздавать интервал на каждом шаге.
  const stateRef = useRef(state);
  stateRef.current = state;

  // Игровой цикл: пока статус «running», поле обновляется с заданной задержкой.
  useEffect(() => {
    if (state.status !== 'running') return undefined;

    const timer = setInterval(() => {
      const { state: next, ateFood } = stepSnake(stateRef.current);
      stateRef.current = next;
      setState(next);

      if (ateFood) {
        // Счёт увеличился — сообщаем о прогрессе наружу.
        onScore?.(next.score);
      }

      if (next.status === 'over') {
        onScore?.(next.score);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [state.status, onScore]);

  // Управление стрелками и WASD.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      const direction = keyMap[event.key];
      if (!direction) return;

      // Не мешаем вводить текст в полях формы.
      const target = event.target;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      event.preventDefault();
      setState((prev) => {
        if (prev.status !== 'running') return prev;
        if (isOppositeDirection(prev.direction, direction)) return prev;
        return { ...prev, nextDirection: direction };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStart = () => {
    setState((prev) => (prev.status === 'over' ? prev : { ...prev, status: 'running' }));
  };

  const handlePause = () => {
    setState((prev) => (prev.status === 'running' ? { ...prev, status: 'paused' } : prev));
  };

  const handleRestart = () => {
    setState(createStartState());
  };

  /** Задаёт направление по экранной кнопке. */
  const handleDirection = (direction) => {
    setState((prev) => {
      if (prev.status !== 'running') return prev;
      if (isOppositeDirection(prev.direction, direction)) return prev;
      return { ...prev, nextDirection: direction };
    });
  };

  const snakeCells = new Set(state.snake.map((part) => `${part.x},${part.y}`));
  const head = state.snake[0];

  return (
    <div className="game game--snake">
      <div className="game__panel">
        <div className="snake__toolbar">
          <span className="snake__score">
            Счёт: <strong>{state.score}</strong>
          </span>

          <div className="snake__actions">
            {state.status === 'running' ? (
              <button type="button" className="button button--primary" onClick={handlePause}>
                Пауза
              </button>
            ) : (
              <button
                type="button"
                className="button button--primary"
                onClick={handleStart}
                disabled={state.status === 'over'}
              >
                {state.status === 'over' ? 'Игра окончена' : 'Играть'}
              </button>
            )}
            <button type="button" className="button button--ghost" onClick={handleRestart}>
              Новая игра
            </button>
          </div>
        </div>

        {state.status === 'ready' ? (
          <p className="alert alert--info" role="status">
            Нажмите «Играть» и управляйте змейкой стрелками или клавишами WASD.
          </p>
        ) : null}

        {state.status === 'paused' ? (
          <p className="alert alert--info" role="status">
            Пауза — нажмите «Играть», чтобы продолжить.
          </p>
        ) : null}

        {state.status === 'over' ? (
          <p className="alert alert--error" role="status">
            {state.gameOverReason}. Итоговый счёт: {state.score}. Нажмите «Новая игра», чтобы
            попробовать ещё раз.
          </p>
        ) : null}

        <div
          className="snake__board"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          role="img"
          aria-label={`Змейка: длина ${state.snake.length}, счёт ${state.score}`}
        >
          {Array.from({ length: COLS * ROWS }, (_, index) => {
            const x = index % COLS;
            const y = Math.floor(index / COLS);
            const isSnake = snakeCells.has(`${x},${y}`);
            const isFood = state.food && state.food.x === x && state.food.y === y;
            const isHead = Boolean(head && head.x === x && head.y === y);

            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={`snake__cell ${isSnake ? 'snake__cell--body' : ''} ${
                  isHead ? 'snake__cell--head' : ''
                } ${isFood ? 'snake__cell--food' : ''}`.trim()}
              />
            );
          })}
        </div>

        <div className="snake__controls" role="group" aria-label="Управление змейкой">
          <div className="snake__controls-row">
            <span className="snake__controls-spacer" />
            <button
              type="button"
              className="snake__control snake__control--up"
              onClick={() => handleDirection('up')}
              disabled={state.status !== 'running'}
              aria-label={DIRECTION_LABELS.up}
            >
              ↑
            </button>
            <span className="snake__controls-spacer" />
          </div>

          <div className="snake__controls-row">
            <button
              type="button"
              className="snake__control snake__control--left"
              onClick={() => handleDirection('left')}
              disabled={state.status !== 'running'}
              aria-label={DIRECTION_LABELS.left}
            >
              ←
            </button>
            <button
              type="button"
              className="snake__control snake__control--down"
              onClick={() => handleDirection('down')}
              disabled={state.status !== 'running'}
              aria-label={DIRECTION_LABELS.down}
            >
              ↓
            </button>
            <button
              type="button"
              className="snake__control snake__control--right"
              onClick={() => handleDirection('right')}
              disabled={state.status !== 'running'}
              aria-label={DIRECTION_LABELS.right}
            >
              →
            </button>
          </div>
        </div>

        <p className="visually-hidden">Направление движения: {state.direction}</p>
      </div>
    </div>
  );
}

/** Направления доступны другим модулям (например, в тестах). */
export { DIRECTIONS, COLS, ROWS, TICK_MS };

/**
 * Чистая игровая логика игры «Змейка».
 * Работает с координатами клеток и не зависит от React или Canvas.
 */

/** Направления движения. */
export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Проверяет, не является ли новое направление разворотом на 180°.
 * Такой ход запрещён: змейка не может врезаться в саму себя «назад».
 */
export function isOppositeDirection(current, next) {
  const a = DIRECTIONS[current];
  const b = DIRECTIONS[next];
  if (!a || !b) return false;
  return a.x + b.x === 0 && a.y + b.y === 0;
}

/**
 * Создаёт начальное состояние игры.
 * @param {number} cols Ширина поля в клетках.
 * @param {number} rows Высота поля в клетках.
 */
export function createInitialSnakeState(cols = 20, rows = 20) {
  const startY = Math.floor(rows / 2);
  const startX = Math.floor(cols / 4);

  const snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  return {
    cols,
    rows,
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: null,
    score: 0,
    status: 'ready', // ready | running | paused | over
    gameOverReason: '',
  };
}

/**
 * Возвращает свободную клетку для еды.
 * Еда не может появиться внутри тела змейки.
 */
export function getRandomFreeCell(cols, rows, snake) {
  const free = [];
  const occupied = new Set(snake.map((part) => `${part.x},${part.y}`));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }

  if (free.length === 0) return null;
  const index = Math.floor(Math.random() * free.length);
  return free[index];
}

/**
 * Перемещает змейку на одну клетку и обновляет счёт.
 * @returns {{ state: object, ateFood: boolean, crashed: boolean }}
 */
export function stepSnake(state) {
  if (state.status !== 'running') {
    return { state, ateFood: false, crashed: false };
  }

  const direction = state.nextDirection;
  const delta = DIRECTIONS[direction];
  const head = state.snake[0];
  const newHead = { x: head.x + delta.x, y: head.y + delta.y };

  // Столкновение со стеной.
  if (newHead.x < 0 || newHead.y < 0 || newHead.x >= state.cols || newHead.y >= state.rows) {
    return {
      state: {
        ...state,
        status: 'over',
        gameOverReason: 'Змейка врезалась в стену',
      },
      ateFood: false,
      crashed: true,
    };
  }

  // Столкновение с собственным телом.
  const hitsSelf = state.snake.some((part) => part.x === newHead.x && part.y === newHead.y);
  if (hitsSelf) {
    return {
      state: {
        ...state,
        status: 'over',
        gameOverReason: 'Змейка врезалась в саму себя',
      },
      ateFood: false,
      crashed: true,
    };
  }

  const ateFood = Boolean(state.food) && state.food.x === newHead.x && state.food.y === newHead.y;

  const snake = [newHead, ...state.snake];
  if (!ateFood) snake.pop();

  const score = ateFood ? state.score + 1 : state.score;

  let food = state.food;
  if (ateFood) {
    food = getRandomFreeCell(state.cols, state.rows, snake);
    // Если свободных клеток не осталось — поле заполнено, игра окончена.
    if (!food) {
      return {
        state: {
          ...state,
          snake,
          food: null,
          score,
          status: 'over',
          gameOverReason: 'Поле заполнено — победа!',
        },
        ateFood: true,
        crashed: false,
      };
    }
  }

  return {
    state: { ...state, snake, direction, food, score },
    ateFood,
    crashed: false,
  };
}

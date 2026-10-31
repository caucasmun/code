/**
 * Учебные данные игры «Змейка».
 */
export const snakeGame = {
  slug: 'snake',
  title: 'Змейка',
  shortDescription: 'Классическая «Змейка» на Canvas: собирайте еду, растите и не врезайтесь в стены.',
  description:
    'Змейка движется по клетчатому полю, вы управляете направлением с клавиатуры или экранными кнопками. Еда появляется в случайной свободной клетке, за неё начисляются очки. Игра знакомит с координатами, массивами и игровым циклом на Canvas.',
  difficulty: 'hard',
  topics: ['Координаты', 'Массивы объектов', 'Canvas', 'Игровой цикл', 'Клавиатура'],
  rules: [
    'Змейка движется по клеткам поля с постоянной скоростью.',
    'Управление: стрелки на клавиатуре или кнопки направлений на экране.',
    'Еда появляется в случайной свободной клетке и никогда не появляется внутри тела змейки.',
    'За каждую еду начисляется одно очко, змейка становится длиннее.',
    'Столкновение со стеной или с собственным телом завершает игру.',
    'Пробел ставит игру на паузу.',
  ],
  completionHint: 'Игра считается пройденной, когда вы соберёте хотя бы 5 единиц еды за один заход.',
  code: `// Учебная версия игры «Змейка» (без React и Canvas — только логика).

const COLS = 20;
const ROWS = 20;
const CELL = 20;          // размер клетки в пикселях
const TICK_MS = 120;      // один «шаг» змейки каждые 120 миллисекунд

// Направления — это смещения по координатам.
const DIRECTIONS = {
  up:    { x: 0,  y: -1 },
  down:  { x: 0,  y: 1 },
  left:  { x: -1, y: 0 },
  right: { x: 1,  y: 0 },
};

// Тело змейки — массив объектов с координатами.
// Первый элемент — голова, второй — шея и так далее.
let snake = [
  { x: 5, y: 10 },
  { x: 4, y: 10 },
  { x: 3, y: 10 },
];

let direction = 'right';
let food = { x: 12, y: 10 };
let score = 0;
let status = 'ready'; // ready | running | paused | over

// Случайная свободная клетка для еды.
function getRandomFreeCell(cols, rows, snake) {
  const occupied = new Set(snake.map((part) => part.x + ',' + part.y));
  const free = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!occupied.has(x + ',' + y)) {
        free.push({ x, y });
      }
    }
  }

  const index = Math.floor(Math.random() * free.length);
  return free[index];
}

// Запрещаем разворот на 180 градусов.
function isOppositeDirection(current, next) {
  return DIRECTIONS[current].x + DIRECTIONS[next].x === 0
      && DIRECTIONS[current].y + DIRECTIONS[next].y === 0;
}

// Один шаг игрового цикла.
function step() {
  if (status !== 'running') return;

  const delta = DIRECTIONS[direction];
  const head = snake[0];
  const newHead = { x: head.x + delta.x, y: head.y + delta.y };

  // Столкновение со стеной.
  if (newHead.x < 0 || newHead.y < 0 || newHead.x >= COLS || newHead.y >= ROWS) {
    status = 'over';
    return;
  }

  // Столкновение с собственным телом.
  const hitsSelf = snake.some((part) => part.x === newHead.x && part.y === newHead.y);
  if (hitsSelf) {
    status = 'over';
    return;
  }

  snake.unshift(newHead); // добавляем новую голову

  // Собрали еду — хвост не убираем, змейка растёт.
  if (food && newHead.x === food.x && newHead.y === food.y) {
    score = score + 1;
    food = getRandomFreeCell(COLS, ROWS, snake);
  } else {
    snake.pop(); // иначе убираем хвост — длина не меняется
  }
}

// Игровой цикл: игра идёт, пока статус running.
function gameLoop() {
  step();

  if (status === 'running') {
    setTimeout(gameLoop, TICK_MS);
  }
}

// Отрисовка на Canvas.
function draw(ctx) {
  ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

  // Еда
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

  // Тело змейки
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
    ctx.fillRect(part.x * CELL, part.y * CELL, CELL, CELL);
  });
}
`,
  breakdown: [
    {
      id: 'coordinates',
      title: 'Координаты X и Y',
      code: `const newHead = { x: head.x + delta.x, y: head.y + delta.y };

if (newHead.x < 0 || newHead.y < 0 || newHead.x >= COLS || newHead.y >= ROWS) {
  status = 'over';
}`,
      explain:
        'Поле — это сетка клеток. У каждой клетки есть координаты: X — столбец (слева направо), Y — строка (сверху вниз). Выход за границы поля означает столкновение со стеной.',
      example:
        'На поле 20×20 клетки с координатами (0, 0) и (19, 19) — углы поля.',
    },
    {
      id: 'snake-array',
      title: 'Массивы объектов',
      code: `let snake = [
  { x: 5, y: 10 },
  { x: 4, y: 10 },
  { x: 3, y: 10 },
];

snake.unshift(newHead);
snake.pop();`,
      explain:
        'Тело змейки — массив объектов, где каждый объект хранит координаты одной клетки. Первый элемент массива — голова. Метод unshift() добавляет элемент в начало, а pop() удаляет последний.',
      example:
        'После unshift() голова всегда snake[0], а длина массива равна длине змейки в клетках.',
    },
    {
      id: 'game-loop',
      title: 'Игровой цикл',
      code: `function gameLoop() {
  step();

  if (status === 'running') {
    setTimeout(gameLoop, TICK_MS);
  }
}`,
      explain:
        'Игровой цикл — это повторяющееся действие: шаг игры, пауза, снова шаг. В браузере его удобно строить на requestAnimationFrame, ограничивая частоту обновления, чтобы змейка двигалась по клеткам с постоянной скоростью.',
      example:
        'При TICK_MS = 120 змейка делает один шаг примерно 8 раз в секунду.',
    },
    {
      id: 'canvas',
      title: 'Отрисовка на Canvas',
      code: `function draw(ctx) {
  ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
    ctx.fillRect(part.x * CELL, part.y * CELL, CELL, CELL);
  });
}`,
      explain:
        'Canvas — это элемент HTML для рисования. Функция draw() очищает поле и рисует еду и каждую клетку тела змейки. Координаты клеток умножаются на размер клетки, чтобы получить пиксели.',
      example:
        'Клетка (3, 4) при CELL = 20 будет нарисована начиная с пикселя (60, 80).',
    },
    {
      id: 'keyboard',
      title: 'Обработка клавиатуры',
      code: `document.addEventListener('keydown', (event) => {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };

  const next = map[event.key];
  if (!next) return;
  if (isOppositeDirection(direction, next)) return;

  direction = next;
  event.preventDefault();
});`,
      explain:
        'Слушатель событий keydown ловит нажатия клавиш. Словарь map переводит названия клавиш в направления. Если направление совпадает с текущим, ход игнорируется — так змейка не разворачивается на 180 градусов.',
      example:
        'Нажатие «стрелка вверх», когда змейка идёт вниз, ничего не изменит.',
    },
    {
      id: 'collisions',
      title: 'Обнаружение столкновений',
      code: `const hitsSelf = snake.some((part) => part.x === newHead.x && part.y === newHead.y);

if (hitsSelf) {
  status = 'over';
}`,
      explain:
        'Метод some() проверяет, есть ли хотя бы одна клетка тела на месте новой головы. Столкновение со стеной проверяется сравнением координат с размерами поля.',
      example:
        'Если голова переместилась в клетку, которую уже занимает тело, игра заканчивается.',
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Измени скорость змейки',
      description:
        'Поменяйте значение TICK_MS: например, 200 — медленнее, 70 — быстрее. Слишком маленькое значение сделает игру неудобной.',
      criteria:
        'После изменения змейка движется с новой скоростью, и игра остаётся управляемой.',
      completionMode: 'manual',
    },
    {
      id: 2,
      title: 'Измени размер игрового поля',
      description:
        'Сделайте поле больше (например, 25×25) или меньше (15×15). Проверьте, что еда по-прежнему появляется только в свободных клетках.',
      criteria:
        'Размер поля изменился, змейка и еда корректно отрисовываются в новых границах.',
      completionMode: 'manual',
    },
    {
      id: 3,
      title: 'Добавь бонусную еду с дополнительными очками',
      description:
        'Добавьте вторую еду другого цвета, которая появляется реже и даёт 3 очка вместо 1.',
      criteria:
        'На поле появляется бонусная еда, за неё начисляется больше очков, чем за обычную.',
      completionMode: 'manual',
    },
    {
      id: 4,
      title: 'Добавь отображение лучшего результата',
      description:
        'Сохраняйте лучший счёт в localStorage и показывайте его рядом с текущим счётом. Кнопка «Новая игра» не должна стирать лучший результат.',
      criteria:
        'Лучший результат виден на экране, сохраняется между играми и не сбрасывается кнопкой «Новая игра».',
      completionMode: 'manual',
    },
  ],
};

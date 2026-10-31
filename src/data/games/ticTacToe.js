/**
 * Учебные данные игры «Крестики-нолики».
 */
export const ticTacToeGame = {
  slug: 'tic-tac-toe',
  title: 'Крестики-нолики',
  shortDescription: 'Классическое поле 3×3: вы играете за X, компьютер — за O.',
  description:
    'Поле 3×3, ваши клетки отмечаются «X», компьютер отвечает «O». Игра учит работать с массивами, индексами и функциями проверки выигрышных комбинаций.',
  difficulty: 'medium',
  topics: ['Массивы', 'Индексы', 'Функции', 'Булевы значения', 'Условия завершения'],
  rules: [
    'Вы играете за X, компьютер — за O.',
    'Ход делается по нажатию на свободную клетку.',
    'Победа — три одинаковых знака в ряд, в столбец или по диагонали.',
    'Компьютер ходит только в свободные клетки.',
    'Если свободных клеток не осталось и победителя нет — ничья.',
    'После завершения раунда новые ходы запрещены.',
  ],
  completionHint: 'Игра считается пройденной, когда вы выигрываете раунд или добиваетесь ничьей.',
  code: `// Учебная версия игры «Крестики-нолики».

const SIZE = 3;

// Поле — это массив из 9 ячеек: null — пусто, 'X' или 'O' — занято.
let board = [null, null, null, null, null, null, null, null, null];

// Все выигрышные линии: 3 строки, 3 столбца и 2 диагонали.
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // строки
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // столбцы
  [0, 4, 8], [2, 4, 6],             // диагонали
];

// Проверяем победителя. Возвращаем объект с победителем и линией.
function checkWinner(board) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: WINNING_LINES[i] };
    }
  }

  return { winner: null, line: null };
}

// Есть ли ещё свободные клетки?
function hasEmptyCell(board) {
  return board.some((cell) => cell === null);
}

// Ход игрока.
function playerMove(index) {
  if (board[index] !== null) return { message: 'Клетка уже занята' };

  board[index] = 'X';
  const { winner, line } = checkWinner(board);

  if (winner) return { status: 'won', winner, line };
  if (!hasEmptyCell(board)) return { status: 'draw' };

  return { status: 'playing' };
}

// Простой ход компьютера: ищем выигрышную клетку,
// затем блокируем клетку, которой игрок может выиграть,
// и только потом выбираем случайную свободную.
function chooseComputerMove(board, computerMark) {
  const emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) emptyCells.push(i);
  }

  if (emptyCells.length === 0) return null;

  // 1. Выигрышный ход.
  for (const cell of emptyCells) {
    const test = board.slice();
    test[cell] = computerMark;
    if (checkWinner(test).winner === computerMark) return cell;
  }

  // 2. Блокировка.
  const playerMark = computerMark === 'O' ? 'X' : 'O';
  for (const cell of emptyCells) {
    const test = board.slice();
    test[cell] = playerMark;
    if (checkWinner(test).winner === playerMark) return cell;
  }

  // 3. Случайный допустимый ход.
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Ход компьютера.
function computerMove() {
  const cell = chooseComputerMove(board, 'O');
  if (cell === null) return { status: 'draw' };

  board[cell] = 'O';
  const { winner, line } = checkWinner(board);

  if (winner) return { status: 'won', winner, line };
  if (!hasEmptyCell(board)) return { status: 'draw' };

  return { status: 'playing' };
}

// Новая игра: полностью очищаем поле.
function restart() {
  board = [null, null, null, null, null, null, null, null, null];
}
`,
  breakdown: [
    {
      id: 'arrays',
      title: 'Массивы и индексы',
      code: `let board = [null, null, null, null, null, null, null, null, null];

board[4] = 'X';`,
      explain:
        'Поле хранится в обычном массиве из 9 элементов. Номер клетки — это её индекс в массиве: от 0 до 8. Индексы удобнее нумеровать с нуля, как это делает JavaScript.',
      example:
        'board[0] — левая верхняя клетка, board[4] — центральная, board[8] — правая нижняя.',
    },
    {
      id: 'destructuring',
      title: 'Деструктуризация массива',
      code: `const [a, b, c] = WINNING_LINES[i];`,
      explain:
        'Деструктуризация позволяет разложить массив на отдельные переменные одной строкой. Здесь мы получаем три номера клеток выигрышной линии.',
      example:
        'Для линии [0, 4, 8] переменные a, b и c получат значения 0, 4 и 8.',
    },
    {
      id: 'winner-check',
      title: 'Проверка выигрышных комбинаций',
      code: `if (board[a] && board[a] === board[b] && board[a] === board[c]) {
  return { winner: board[a], line: WINNING_LINES[i] };
}`,
      explain:
        'Проходим по всем восьми линиям и проверяем, что три клетки заняты одним знаком. Первое условие board[a] нужно, чтобы пустые клетки (null) не считались победой.',
      example:
        'Если в клетках 0, 4 и 8 стоят три «X», функция вернёт winner: "X".',
    },
    {
      id: 'booleans',
      title: 'Булевы значения',
      code: `function hasEmptyCell(board) {
  return board.some((cell) => cell === null);
}`,
      explain:
        'Логические значения true и false — это ответ на вопрос «да или нет». Метод some() возвращает true, если хотя бы у одной клетки значение равно null.',
      example:
        'hasEmptyCell вернёт true в начале игры и false, когда все клетки заняты.',
    },
    {
      id: 'game-end',
      title: 'Условия завершения игры',
      code: `const { winner, line } = checkWinner(board);

if (winner) return { status: 'won', winner, line };
if (!hasEmptyCell(board)) return { status: 'draw' };

return { status: 'playing' };`,
      explain:
        'После каждого хода проверяем два условия: есть ли победитель и остались ли свободные клетки. Если ни то, ни другое — игра продолжается.',
      example:
        'Заполненное поле без победителя означает ничью — статус "draw".',
    },
    {
      id: 'computer-move',
      title: 'Алгоритм выбора хода компьютера',
      code: `// 1. Выигрышный ход.
for (const cell of emptyCells) {
  const test = board.slice();
  test[cell] = computerMark;
  if (checkWinner(test).winner === computerMark) return cell;
}

// 2. Блокировка хода игрока.
for (const cell of emptyCells) {
  const test = board.slice();
  test[cell] = playerMark;
  if (checkWinner(test).winner === playerMark) return cell;
}

// 3. Случайный допустимый ход.
return emptyCells[Math.floor(Math.random() * emptyCells.length)];`,
      explain:
        'Это простая эвристика, а не сложный искусственный интеллект. Сначала компьютер проверяет, может ли он выиграть сейчас. Если нет — ищет клетку, которую игрок может занять следующим ходом, и закрывает её. Иначе выбирает случайную свободную клетку.',
      example:
        'Если игрок занял клетки 0 и 1, компьютер сначала попробует занять клетку 2, чтобы не дать выиграть.',
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Измени символы игроков',
      description:
        'Замените «X» и «O» на любые другие знаки: например, «К» и «Н» или «●» и «○». Не забудьте обновить подписи игроков и счёт.',
      criteria:
        'На поле и в счёте используются новые символы, и игра по-прежнему корректно определяет победителя.',
      completionMode: 'manual',
    },
    {
      id: 2,
      title: 'Добавь счёт побед каждого игрока',
      description:
        'Храните счёт побежд отдельно для игрока и компьютера и выводите его под полем. Счёт должен обнуляться только по кнопке полного сброса.',
      criteria:
        'Под полем видны счётчики побед игрока и компьютера, они увеличиваются после выигранных раундов.',
      completionMode: 'manual',
    },
    {
      id: 3,
      title: 'Реализуй подсветку выигрышной линии',
      description:
        'После победы выделяйте клетки выигрышной комбинации: например, добавьте им отдельный CSS-класс или измените цвет.',
      criteria:
        'После победы выигрышные клетки визуально выделены, а остальные — нет.',
      completionMode: 'manual',
    },
    {
      id: 4,
      title: 'Добавь режим двух игроков на одном устройстве',
      description:
        'Добавьте переключатель режима. В режиме «Два игрока» компьютер не ходит, а игроки ходят по очереди: X, затем O.',
      criteria:
        'В режиме двух игроков компьютер не делает ходов, символы чередуются, и победа одного из игроков определяется так же.',
      completionMode: 'manual',
    },
  ],
};

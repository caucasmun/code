/**
 * Учебные данные игры «Камень, ножницы, бумага».
 */
export const rockPaperScissorsGame = {
  slug: 'rock-paper-scissors',
  title: 'Камень, ножницы, бумага',
  shortDescription: 'Классическая игра на удачу: камень, ножницы или бумага против компьютера.',
  description:
    'Вы выбираете камень, ножницы или бумагу, компьютер выбирает случайно. Камень побеждает ножницы, ножницы побеждают бумагу, бумага побеждает камень. Игра показывает, как работают массивы, случайный выбор и чистые функции.',
  difficulty: 'easy',
  topics: ['Массивы', 'Случайный выбор', 'Условия', 'Функции'],
  rules: [
    'Выберите один из трёх вариантов: камень, ножницы или бумагу.',
    'Компьютер выбирает вариант случайно.',
    'Камень побеждает ножницы, ножницы побеждают бумагу, бумага побеждает камень.',
    'Одинаковые варианты дают ничью — раунд засчитывается в счёт ничьих.',
    'Счёт ведётся по всем раундам, его можно сбросить кнопкой «Сбросить счёт».',
  ],
  completionHint: 'Игра считается пройденной, когда вы выигрываете хотя бы один раунд.',
  code: `// Учебная версия игры «Камень, ножницы, бумага».
// Игровая логика отделена от интерфейса — это важный принцип.

// Возможные ходы храним в массиве.
const MOVES = ['rock', 'scissors', 'paper'];

// Что побеждает что. Ключ — наш ход, значение — побеждённый им ход.
const BEATS = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
};

// Случайный выбор компьютера: получаем индекс и берём элемент массива.
function getRandomMove(moves) {
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}

// Чистая функция: только определяет результат, ничего не меняет.
function determineResult(playerMove, computerMove) {
  if (playerMove === computerMove) {
    return 'draw';
  }

  if (BEATS[playerMove] === computerMove) {
    return 'win';
  }

  return 'lose';
}

// Счёт: объект со счётчиками.
let score = { wins: 0, losses: 0, draws: 0 };

// Один раунд игры.
function playRound(playerMove) {
  const computerMove = getRandomMove(MOVES);
  const result = determineResult(playerMove, computerMove);

  if (result === 'win') {
    score.wins = score.wins + 1;
  } else if (result === 'lose') {
    score.losses = score.losses + 1;
  } else {
    score.draws = score.draws + 1;
  }

  return { playerMove, computerMove, result, score };
}

// Сброс счёта — новая сессия с нуля.
function resetScore() {
  score = { wins: 0, losses: 0, draws: 0 };
}
`,
  breakdown: [
    {
      id: 'arrays',
      title: 'Массивы',
      code: `const MOVES = ['rock', 'scissors', 'paper'];`,
      explain:
        'Массив хранит упорядоченный список значений. Все возможные ходы хранятся в одном массиве — так их легко перебрать в цикле и показать в интерфейсе.',
      example:
        'MOVES[0] — это "rock", а MOVES.length равно 3.',
    },
    {
      id: 'random',
      title: 'Случайный выбор из массива',
      code: `function getRandomMove(moves) {
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}`,
      explain:
        'Math.random() даёт число от 0 (включительно) до 1 (не включительно). Умножаем на длину массива и округляем вниз — получаем случайный индекс, а затем берём элемент по этому индексу.',
      example:
        'При длине массива 3 индекс будет 0, 1 или 2 — ни одна клетка не выйдет за границы.',
    },
    {
      id: 'conditions',
      title: 'Условия и правила победы',
      code: `function determineResult(playerMove, computerMove) {
  if (playerMove === computerMove) {
    return 'draw';
  }

  if (BEATS[playerMove] === computerMove) {
    return 'win';
  }

  return 'lose';
}`,
      explain:
        'Сначала проверяем ничью, потом победу по таблице BEATS. Если ни одно условие не выполнилось — поражение. Порядок проверок важен: сначала всегда обрабатывается самый «частый» случай.',
      example:
        'Игрок выбрал "rock", компьютер — "scissors": BEATS.rock равно "scissors", значит победа игрока.',
    },
    {
      id: 'pure-functions',
      title: 'Чистые функции и возвращаемые значения',
      code: `function determineResult(playerMove, computerMove) {
  // ...возвращает только 'win', 'lose' или 'draw'...
}

const result = determineResult(playerMove, computerMove);`,
      explain:
        'Чистая функция не меняет внешние данные — она только получает аргументы и возвращает результат. Благодаря этому её легко тестировать и переиспользовать в других частях программы.',
      example:
        'Функцию determineResult можно вызвать в тесте и проверить, что камень бьёт ножницы, не запуская саму игру.',
    },
    {
      id: 'separation',
      title: 'Разделение игровой логики и интерфейса',
      code: `function playRound(playerMove) {
  const computerMove = getRandomMove(MOVES);
  const result = determineResult(playerMove, computerMove);

  if (result === 'win') {
    score.wins = score.wins + 1;
  }

  return { playerMove, computerMove, result, score };
}`,
      explain:
        'Логика игры ничего не знает про React и про кнопки. Она принимает ход игрока и возвращает объект с результатом — интерфейсу остаётся только показать его. Такой подход упрощает тестирование и перенос игры на другую платформу.',
      example:
        'Кнопка в интерфейсе просто вызывает playRound("rock") и рисует то, что вернулось.',
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Добавь лучший результат по количеству побед подряд',
      description:
        'Считайте серию побед подряд и запоминайте максимальную. Выводите её рядом со счётом. Счётчик серии обнуляется при поражении или ничьей.',
      criteria:
        'На экране видна лучшая серия побед подряд, счётчик обнуляется при поражении и ничьей, а личный рекорд не уменьшается.',
      completionMode: 'manual',
    },
    {
      id: 2,
      title: 'Добавь режим игры до трёх побед',
      description:
        'Сделайте матч: игра идёт до тех пор, пока один из участников не наберёт 3 победы. После этого покажите итог матча и предложите начать новый.',
      criteria:
        'Матч заканчивается при достижении 3 побед, показывается победитель матча и кнопка нового матча.',
      completionMode: 'manual',
    },
    {
      id: 3,
      title: 'Добавь историю последних пяти раундов',
      description:
        'Храните результаты последних пяти раундов и показывайте их списком: «Камень — Ножницы: победа».',
      criteria:
        'Виден список из последних пяти раундов с ходами и результатом, старые раунды исчезают.',
      completionMode: 'manual',
    },
    {
      id: 4,
      title: 'Добавь кнопку нового матча без удаления общей статистики',
      description:
        'Кнопка «Новый матч» должна обнулять счёт текущего матча, но не стирать общую статистику (например, число всех сыгранных раундов).',
      criteria:
        'После нового матча счёт матча обнуляется, а общая статистика сохраняется.',
      completionMode: 'manual',
    },
  ],
};

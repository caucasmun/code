/**
 * Учебные данные игры «Угадай число».
 * Поле code — это логически завершённая учебная версия игры,
 * на основе которой написана игровая логика приложения.
 */
export const guessNumberGame = {
  slug: 'guess-number',
  title: 'Угадай число',
  shortDescription: 'Компьютер загадывает число от 1 до 100 — найдите его за минимум попыток.',
  description:
    'Компьютер случайно выбирает число от 1 до 100. Вы вводите предположение и получаете подсказку: «больше» или «меньше». Игра учит работать с переменными, условиями и случайными числами.',
  difficulty: 'easy',
  topics: ['Переменные', 'Условия', 'Случайные числа', 'Ввод пользователя'],
  rules: [
    'Компьютер загадывает целое число от 1 до 100.',
    'Вы вводите число в поле и нажимаете «Проверить» (или Enter).',
    'Если загаданное число больше вашего — появится подсказка «Загаданное число больше».',
    'Если загаданное число меньше вашего — появится подсказка «Загаданное число меньше».',
    'Когда число найдено, игра заканчивается и показывается количество попыток.',
  ],
  completionHint: 'Игра считается пройденной, когда вы угадаете загаданное число.',
  code: `// Учебная версия игры «Угадай число».
// Здесь показана вся логика игры без React — так её проще понять.

const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

// 1. Загадываем случайное число.
// Math.random() возвращает число от 0 до 1 (не включая 1).
// Math.floor() округляет вниз, +1 превращает 0 в 1.
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 2. Сравниваем предположение с загаданным числом.
function compareGuess(guess, secret) {
  if (guess < secret) return 'greater'; // загаданное число больше
  if (guess > secret) return 'less';    // загаданное число меньше
  return 'equal';
}

// 3. Проверяем, что ввёл пользователь.
function parseUserInput(rawInput, min, max) {
  const text = String(rawInput).trim();

  if (text === '') {
    return { error: 'Введите число' };
  }

  if (!/^-?\\d+$/.test(text)) {
    return { error: 'Введите целое число' };
  }

  const value = Number(text);

  if (value < min || value > max) {
    return { error: 'Число должно быть от ' + min + ' до ' + max };
  }

  return { value, error: null };
}

// 4. Состояние игры.
let secret = getRandomNumber(MIN_NUMBER, MAX_NUMBER);
let attempts = 0;
let history = [];
let finished = false;

// 5. Обработка одной попытки.
function submitGuess(rawInput) {
  if (finished) {
    return { message: 'Игра уже закончена' };
  }

  const { value, error } = parseUserInput(rawInput, MIN_NUMBER, MAX_NUMBER);
  if (error) {
    return { message: error };
  }

  attempts = attempts + 1;
  history.push(value);

  const result = compareGuess(value, secret);

  if (result === 'equal') {
    finished = true;
    return { message: 'Верно! Это число ' + secret, attempts, finished };
  }

  const hint = result === 'greater'
    ? 'Загаданное число больше'
    : 'Загаданное число меньше';

  return { message: hint, attempts, finished };
}
`,
  breakdown: [
    {
      id: 'variables',
      title: 'Переменные и константы',
      code: `const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

let secret = getRandomNumber(MIN_NUMBER, MAX_NUMBER);
let attempts = 0;`,
      explain:
        'Константа (const) хранит значение, которое не меняется, — границы диапазона. Переменная (let) хранит значение, которое меняется: загаданное число, число попыток, историю ходов.',
      example:
        'Повторное присваивание attempts = attempts + 1 увеличивает счётчик попыток на один.',
    },
    {
      id: 'random',
      title: 'Случайное число в диапазоне',
      code: `function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}`,
      explain:
        'Math.random() возвращает число от 0 (включительно) до 1 (не включительно). Умножаем на количество возможных значений, округляем вниз через Math.floor и прибавляем минимум.',
      example:
        'При min = 1 и max = 100 функция вернёт целое число от 1 до 100 включительно.',
    },
    {
      id: 'conditions',
      title: 'Условия и ранний выход',
      code: `function compareGuess(guess, secret) {
  if (guess < secret) return 'greater';
  if (guess > secret) return 'less';
  return 'equal';
}`,
      explain:
        'Условие if проверяет истинность выражения. Когда значение истинно, выполняется блок, а return сразу завершает функцию — код после него не выполняется.',
      example:
        'Если предположение равно загаданному числу, выполняется только третья строка и возвращается "equal".',
    },
    {
      id: 'input-validation',
      title: 'Проверка пользовательского ввода',
      code: `if (text === '') {
  return { error: 'Введите число' };
}

if (!/^-?\\d+$/.test(text)) {
  return { error: 'Введите целое число' };
}

if (value < min || value > max) {
  return { error: 'Число должно быть от ' + min + ' до ' + max };
}`,
      explain:
        'Пользователь может ввести что угодно, поэтому ввод проверяется до использования. Регулярное выражение проверяет, что строка состоит только из цифр, а условие с || ловит выход за границы диапазона.',
      example:
        'Ввод «abc» вернёт ошибку «Введите целое число», а ввод «500» — «Число должно быть от 1 до 100».',
    },
    {
      id: 'state',
      title: 'Состояние игры',
      code: `let secret = getRandomNumber(MIN_NUMBER, MAX_NUMBER);
let attempts = 0;
let history = [];
let finished = false;`,
      explain:
        'Состояние игры — это набор переменных, которые описывают текущий момент: что загадано, сколько было попыток, какие числа уже называли. Отдельный флаг finished не даёт играть после победы.',
      example:
        'Массив history хранит все попытки, поэтому их можно показать в конце игры.',
    },
    {
      id: 'separation',
      title: 'Разделение игровой логики и интерфейса',
      code: `function submitGuess(rawInput) {
  const { value, error } = parseUserInput(rawInput, MIN_NUMBER, MAX_NUMBER);
  if (error) {
    return { message: error };
  }

  attempts = attempts + 1;
  history.push(value);

  return { message: hint, attempts, finished };
}`,
      explain:
        'Логика игры ничего не знает про React и про кнопки. Она принимает введённое значение и возвращает объект с сообщением и состоянием — интерфейсу остаётся только показать результат. Такой подход упрощает тестирование.',
      example:
        'Поле ввода просто вызывает submitGuess(value) и рисует то, что вернулось.',
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Измени диапазон загаданного числа',
      description:
        'Сделайте так, чтобы компьютер загадывал число от 1 до 50. Поменяйте константу MAX_NUMBER и не забудьте поправить текст подсказки об ошибке ввода.',
      criteria:
        'Игра принимает числа до 50 включительно, а при вводе 51 показывает сообщение о допустимом диапазоне.',
      completionMode: 'manual',
    },
    {
      id: 2,
      title: 'Добавь счётчик отгаданных игр',
      description:
        'Сделайте так, чтобы счётчик «Отгадано: N» сохранялся между играми. При новой игре число попыток обнуляется, а общий счёт — нет.',
      criteria:
        'Виден общий счётчик отгаданных игр, он увеличивается после победы и не сбрасывается кнопкой «Новая игра».',
      completionMode: 'manual',
    },
    {
      id: 3,
      title: 'Покажи историю попыток',
      description:
        'Выведите список всех названных чисел по порядку и рядом с каждым — подсказку, которая тогда была («больше» или «меньше»).',
      criteria:
        'На экране виден список всех попыток с подсказками, новые попытки добавляются в конец списка.',
      completionMode: 'manual',
    },
    {
      id: 4,
      title: 'Добавь режим подсказки за игру',
      description:
        'После проигрыша покажите загаданное число и предложите сыграть ещё раз одной кнопкой.',
      criteria:
        'После поражения видно загаданное число и кнопка «Новая игра», которая начинает игру заново.',
      completionMode: 'manual',
    },
  ],
};

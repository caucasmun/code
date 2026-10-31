/**
 * Учебные данные игры «Виселица».
 */
export const hangmanGame = {
  slug: 'hangman',
  title: 'Виселица',
  shortDescription: 'Отгадайте слово по буквам — на каждой ошибке теряется одна попытка.',
  description:
    'Компьютер загадывает слово из русского словаря. Вы открываете буквы по одной, но ошибаться можно только шесть раз. Игра учит работать со строками, массивами и проверкой условий.',
  difficulty: 'medium',
  topics: ['Строки', 'Массивы', 'Условия', 'Состояние игры'],
  rules: [
    'Загадывается одно слово из словаря, все буквы скрыты.',
    'Нажимайте буквы на экранной клавиатуре, чтобы открыть их.',
    'Если буквы в слове нет — засчитывается ошибка.',
    'Всего можно ошибиться 6 раз, затем игра проиграна.',
    'Победа — открыть все буквы слова.',
    'Кнопка «Новая игра» выбирает другое слово.',
  ],
  completionHint: 'Игра считается пройденной, когда вы отгадаете слово.',
  code: `// Учебная версия игры «Виселица».

// Словарь: все слова записаны заглавными буквами.
const WORDS = [
  'КОД',
  'ПРОГРАММА',
  'АЛГОРИТМ',
  'ПЕРЕМЕННАЯ',
  'ФУНКЦИЯ',
  'МАССИВ',
  'ОБЪЕКТ',
  'ЦИКЛ',
  'УСЛОВИЕ',
];

// Сколько раз можно ошибиться.
const MAX_MISTAKES = 6;

// 1. Новое состояние игры: выбираем случайное слово.
function createGame() {
  const index = Math.floor(Math.random() * WORDS.length);
  const word = WORDS[index];

  return {
    word,
    guessedLetters: [],
    wrongLetters: [],
    mistakes: 0,
    status: 'playing',
  };
}

// 2. Показываем слово с открытыми буквами.
function getMaskedWord(word, guessedLetters) {
  return word
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');
}

// 3. Проверяем, открыто ли всё слово.
function isWordGuessed(word, guessedLetters) {
  return word.split('').every((letter) => guessedLetters.includes(letter));
}

// 4. Ход игрока: одна буква.
function guessLetter(state, letter) {
  if (state.status !== 'playing') return state;

  // Повторная буква не считается новой попыткой.
  if (state.guessedLetters.includes(letter) || state.wrongLetters.includes(letter)) {
    return state;
  }

  if (state.word.includes(letter)) {
    const guessedLetters = [...state.guessedLetters, letter];
    const won = isWordGuessed(state.word, guessedLetters);

    return {
      ...state,
      guessedLetters,
      status: won ? 'won' : 'playing',
    };
  }

  const mistakes = state.mistakes + 1;

  return {
    ...state,
    wrongLetters: [...state.wrongLetters, letter],
    mistakes,
    status: mistakes >= MAX_MISTAKES ? 'lost' : 'playing',
  };
}
`,
  breakdown: [
    {
      id: 'strings',
      title: 'Работа со строками',
      code: `function getMaskedWord(word, guessedLetters) {
  return word
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');
}`,
      explain:
        'Строку можно превратить в массив символов методом split, обработать каждый символ через map() и собрать обратно через join(). Метод includes() проверяет, есть ли буква в массиве.',
      example:
        'Слово «КОД» превратится в массив [\'К\', \'О\', \'Д\'], а неоткрытые буквы заменятся на «_».',
    },
    {
      id: 'every',
      title: 'Проверка всех букв сразу',
      code: `function isWordGuessed(word, guessedLetters) {
  return word.split('').every((letter) => guessedLetters.includes(letter));
}`,
      explain:
        'Метод every() возвращает true, только если условие выполнено для каждого элемента массива. Это удобный способ проверить, что открыты все буквы слова.',
      example:
        'Если открыты «К» и «О», но не «Д», every() вернёт false.',
    },
    {
      id: 'includes',
      title: 'Поиск буквы в слове',
      code: `if (state.word.includes(letter)) {
  const guessedLetters = [...state.guessedLetters, letter];
}`,
      explain:
        'Метод includes() у строки отвечает на вопрос «есть ли такая буква в слове». Оператор spread [...] создаёт новый массив, не изменяя старый — так состояние остаётся неизменяемым.',
      example:
        '«КОД».includes(\'О\') вернёт true, а «КОД».includes(\'Л\') — false.',
    },
    {
      id: 'immutability',
      title: 'Неизменяемое состояние',
      code: `return {
  ...state,
  wrongLetters: [...state.wrongLetters, letter],
  mistakes,
  status: mistakes >= MAX_MISTAKES ? 'lost' : 'playing',
};`,
      explain:
        'Вместо изменения готового объекта создаётся новый через spread. Старое состояние остаётся нетронутым, поэтому его легко откатить и сравнить — это важно для тестов и отладки.',
      example:
        'После ошибки в wrongLetters появляется новая буква, а предыдущие буквы сохраняются в том же порядке.',
    },
    {
      id: 'conditions',
      title: 'Условия и статусы игры',
      code: `const mistakes = state.mistakes + 1;

return {
  ...state,
  mistakes,
  status: mistakes >= MAX_MISTAKES ? 'lost' : 'playing',
};`,
      explain:
        'Тернарный оператор выбирает одно из двух значений по условию. Здесь он решает, завершена ли игра: пока ошибок меньше лимита — статус playing, иначе lost.',
      example:
        'При MAX_MISTAKES = 6 шестая ошибка переводит игру в статус lost.',
    },
    {
      id: 'state',
      title: 'Состояние игры',
      code: `return {
  word,
  guessedLetters: [],
  wrongLetters: [],
  mistakes: 0,
  status: 'playing',
};`,
      explain:
        'Состояние хранит всё, что нужно для отображения: загаданное слово, открытые и ошибочные буквы, число ошибок и статус. Новая игра — это просто новый объект состояния.',
      example:
        'Поле «_ _ _» превратится в «К О Д», когда будут открыты все три буквы.',
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Добавь новую категорию слов',
      description:
        'Добавьте в словарь WORDS ещё 5–7 слов, например, по теме «Природа». Убедитесь, что все слова записаны заглавными буквами.',
      criteria:
        'В игре появляются новые слова, и в списке слов видно, что их больше, чем было изначально.',
      completionMode: 'manual',
    },
    {
      id: 2,
      title: 'Измени лимит ошибок',
      description:
        'Поменяйте константу MAX_MISTAKES (например, на 8 или 5). Игра должна показывать новый лимит и завершаться ровно тогда, когда ошибок становится столько, сколько установлено.',
      criteria:
        'На экране виден новый лимит ошибок, и игра заканчивается поражением именно после указанного количества ошибок.',
      completionMode: 'manual',
    },
    {
      id: 3,
      title: 'Показывай количество букв в слове',
      description: 'Выведите рядом со словом подсказку вида «В слове 6 букв».',
      criteria: 'Во время игры видно, сколько букв содержится в загаданном слове.',
      completionMode: 'manual',
    },
    {
      id: 4,
      title: 'Добавь счётчик выигранных раундов',
      description:
        'Считайте количество побед за всю сессию и показывайте его рядом со счётчиком ошибок. Счётчик должен обнуляться при новой игре.',
      criteria:
        'На экране виден счётчик побед, он увеличивается после отгаданного слова и обнуляется при новой игре.',
      completionMode: 'manual',
    },
  ],
};

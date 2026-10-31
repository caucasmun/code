/**
 * Чистая игровая логика игры «Виселица».
 */

/** Русский алфавит для экранной клавиатуры. */
export const RUSSIAN_ALPHABET = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й',
  'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф',
  'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
];

/** Лимит ошибок по умолчанию. */
export const DEFAULT_MAX_MISTAKES = 6;

/**
 * Нормализует букву: верхний регистр, кириллица.
 * @returns {string|null} Буква или null, если символ не является буквой.
 */
export function normalizeLetter(letter) {
  if (typeof letter !== 'string') return null;
  const upper = letter.trim().toUpperCase();
  if (!upper) return null;
  if (!RUSSIAN_ALPHABET.includes(upper)) return null;
  return upper;
}

/**
 * Проверяет, все ли буквы слова открыты.
 */
export function isWordGuessed(word, guessedLetters) {
  const letters = word.split('');
  return letters.every((letter) => guessedLetters.includes(letter));
}

/**
 * Открывает букву в слове: возвращает массив символов,
 * где найденные буквы показаны, остальные скрыты.
 */
export function getMaskedWord(word, guessedLetters) {
  return word.split('').map((letter) => (guessedLetters.includes(letter) ? letter : '_'));
}

/**
 * Создаёт состояние новой игры.
 * @param {string[]} words Словарь.
 */
export function createInitialHangmanState(words, maxMistakes = DEFAULT_MAX_MISTAKES) {
  const list = Array.isArray(words) && words.length > 0 ? words : ['КОД'];
  const index = Math.floor(Math.random() * list.length);
  const word = list[index].toUpperCase();

  return {
    word,
    guessedLetters: [],
    wrongLetters: [],
    mistakes: 0,
    maxMistakes,
    status: 'playing', // playing | won | lost
    message: '',
  };
}

/**
 * Обрабатывает ввод буквы игроком.
 * @returns {object} Новое состояние игры.
 */
export function guessLetter(state, rawLetter) {
  if (state.status !== 'playing') return state;

  const letter = normalizeLetter(rawLetter);
  if (!letter) return state;

  // Повторная буква не считается новой попыткой.
  if (state.guessedLetters.includes(letter) || state.wrongLetters.includes(letter)) {
    return { ...state, message: `Буква «${letter}» уже использована` };
  }

  if (state.word.includes(letter)) {
    const guessedLetters = [...state.guessedLetters, letter];
    const won = isWordGuessed(state.word, guessedLetters);
    return {
      ...state,
      guessedLetters,
      message: won ? 'Слово отгадано!' : `Буква «${letter}» есть в слове`,
      status: won ? 'won' : 'playing',
    };
  }

  const mistakes = state.mistakes + 1;
  const wrongLetters = [...state.wrongLetters, letter];
  const lost = mistakes >= state.maxMistakes;

  return {
    ...state,
    mistakes,
    wrongLetters,
    message: lost ? 'К сожалению, попытки закончились' : `Буквы «${letter}» в слове нет`,
    status: lost ? 'lost' : 'playing',
  };
}

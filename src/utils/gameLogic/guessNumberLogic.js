/**
 * Чистая игровая логика игры «Угадай число».
 * Все функции не зависят от React и могут проверяться в тестах.
 */

/** Диапазон загаданного числа по умолчанию. */
export const MIN_NUMBER = 1;
export const MAX_NUMBER = 100;

/**
 * Генерирует случайное целое число в диапазоне [min, max].
 * Math.random() даёт число от 0 (включительно) до 1 (не включительно),
 * поэтому к нему прибавляют min и округляют вниз через Math.floor.
 */
export function getRandomNumber(min = MIN_NUMBER, max = MAX_NUMBER) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Результат сравнения предположения с загаданным числом. */
export const COMPARE_RESULT = {
  LOWER: 'lower', // загаданное число меньше предположения
  HIGHER: 'higher', // загаданное число больше предположения
  EQUAL: 'equal',
  OUT_OF_RANGE: 'out-of-range',
};

/**
 * Сравнивает предположение с загаданным числом.
 */
export function compareGuess(guess, secret) {
  if (guess < secret) return COMPARE_RESULT.HIGHER;
  if (guess > secret) return COMPARE_RESULT.LOWER;
  return COMPARE_RESULT.EQUAL;
}

/** Тексты подсказок для каждого результата. */
export const HINTS = {
  [COMPARE_RESULT.HIGHER]: 'Загаданное число больше',
  [COMPARE_RESULT.LOWER]: 'Загаданное число меньше',
};

/**
 * Создаёт новое состояние игры.
 */
export function createInitialGuessNumberState(min = MIN_NUMBER, max = MAX_NUMBER) {
  return {
    secret: getRandomNumber(min, max),
    min,
    max,
    attempts: 0,
    history: [],
    hint: '',
    status: 'playing', // playing | won
    input: '',
    error: '',
  };
}

/**
 * Обрабатывает попытку пользователя.
 * Возвращает новое состояние игры (объект не мутируется).
 *
 * @param {object} state Текущее состояние.
 * @param {string} rawInput Введённое пользователем значение (строка).
 */
export function submitGuess(state, rawInput) {
  if (state.status !== 'playing') return state;

  const text = String(rawInput ?? '').trim();

  if (!text) {
    return { ...state, input: '', error: 'Введите число' };
  }

  if (!/^-?\d+$/.test(text)) {
    return { ...state, input: text, error: 'Введите целое число' };
  }

  const guess = Number(text);

  if (guess < state.min || guess > state.max) {
    return {
      ...state,
      input: text,
      error: `Число должно быть от ${state.min} до ${state.max}`,
    };
  }

  const result = compareGuess(guess, state.secret);
  const attempts = state.attempts + 1;
  const history = [...state.history, { guess, result }];

  if (result === COMPARE_RESULT.EQUAL) {
    return {
      ...state,
      attempts,
      history,
      input: '',
      error: '',
      hint: '',
      status: 'won',
    };
  }

  return {
    ...state,
    attempts,
    history,
    input: '',
    error: '',
    hint: HINTS[result],
    status: 'playing',
  };
}

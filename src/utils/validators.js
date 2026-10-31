/** Проверка формата email. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Минимальная длина пароля. */
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Проверяет email.
 * @returns {string|null} Текст ошибки или null, если всё в порядке.
 */
export function validateEmail(email) {
  const value = (email || '').trim();
  if (!value) return 'Введите email';
  if (!EMAIL_PATTERN.test(value)) return 'Email имеет неверный формат';
  return null;
}

/**
 * Проверяет пароль.
 * @returns {string|null} Текст ошибки или null, если всё в порядке.
 */
export function validatePassword(password) {
  const value = password || '';
  if (!value) return 'Введите пароль';
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Пароль должен содержать не меньше ${MIN_PASSWORD_LENGTH} символов`;
  }
  return null;
}

/**
 * Проверяет совпадение двух паролей.
 */
export function validatePasswordMatch(password, passwordConfirm) {
  if (!passwordConfirm) return 'Повторите пароль';
  if (password !== passwordConfirm) return 'Пароли не совпадают';
  return null;
}

/**
 * Проверяет целое число в диапазоне.
 * Используется в игре «Угадай число» для проверки пользовательского ввода.
 */
export function validateIntegerInRange(value, min, max) {
  const text = String(value ?? '').trim();
  if (!text) return 'Введите число';
  if (!/^-?\d+$/.test(text)) return 'Введите целое число';
  const number = Number(text);
  if (!Number.isFinite(number)) return 'Введите целое число';
  if (number < min || number > max) return `Число должно быть от ${min} до ${max}`;
  return null;
}

/**
 * Проверяет форму входа.
 * @returns {{ email: string|null, password: string|null }} Ошибки по полям.
 */
export function validateLoginForm({ email, password }) {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
}

/**
 * Проверяет форму регистрации.
 * @returns {{ email: string|null, password: string|null, passwordConfirm: string|null }}
 */
export function validateRegisterForm({ email, password, passwordConfirm }) {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
    passwordConfirm: validatePasswordMatch(password, passwordConfirm),
  };
}

/** Возвращает true, если в объекте ошибок есть хотя бы одна. */
export function hasErrors(errors) {
  return Object.values(errors).some((error) => Boolean(error));
}

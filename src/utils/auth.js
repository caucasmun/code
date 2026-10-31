/**
 * Демонстрационная локальная авторизация.
 *
 * ВАЖНО: это не настоящая серверная авторизация. Все данные хранятся
 * в localStorage браузера, а хеширование выполняется на стороне клиента.
 * Пользователь может изменить данные приложения и обойти любые проверки.
 * Схема нужна только для школьной демонстрации клиентской логики.
 */

/** Параметры вывода ключа PBKDF2. */
const PBKDF2_ITERATIONS = 150000;
const PBKDF2_KEY_LENGTH = 32; // 32 байта = 256 бит
const PBKDF2_HASH = 'SHA-256';

/** Сообщение для случая, когда Web Crypto API недоступен. */
export const CRYPTO_UNAVAILABLE_MESSAGE =
  'Браузер не поддерживает безопасное хеширование пароля (Web Crypto API недоступен). Попробуйте другой браузер или включите HTTPS.';

/** Проверяет доступность Web Crypto API. */
export function isCryptoAvailable() {
  return (
    typeof window !== 'undefined' &&
    typeof window.crypto !== 'undefined' &&
    typeof window.crypto.subtle !== 'undefined' &&
    typeof window.crypto.getRandomValues === 'function'
  );
}

function getSubtle() {
  return window.crypto.subtle;
}

/** Кодирует строку в UTF-8 байты. */
function toBytes(text) {
  return new TextEncoder().encode(text);
}

/** Преобразует ArrayBuffer в hex-строку. */
function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Создаёт криптографически случайную соль (16 байт) в hex-формате.
 * Соль уникальна для каждой учётной записи.
 */
export function generateSalt() {
  if (!isCryptoAvailable()) {
    throw new Error(CRYPTO_UNAVAILABLE_MESSAGE);
  }
  const saltBytes = new Uint8Array(16);
  window.crypto.getRandomValues(saltBytes);
  return bufferToHex(saltBytes.buffer);
}

/**
 * Вычисляет хеш пароля через PBKDF2-SHA-256 с заданной солью.
 * @param {string} password Пароль в открытом виде (в памяти, не в хранилище).
 * @param {string} salt Hex-соль.
 * @returns {Promise<string>} hex-хеш.
 */
export async function hashPassword(password, salt) {
  if (!isCryptoAvailable()) {
    throw new Error(CRYPTO_UNAVAILABLE_MESSAGE);
  }

  const keyMaterial = await getSubtle().importKey('raw', toBytes(password), 'PBKDF2', false, [
    'deriveBits',
  ]);

  const bits = await getSubtle().deriveBits(
    {
      name: 'PBKDF2',
      salt: toBytes(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    PBKDF2_KEY_LENGTH * 8,
  );

  return bufferToHex(bits);
}

/**
 * Создаёт уникальный идентификатор пользователя.
 * Используется crypto.randomUUID, если он доступен, иначе — случайные байты.
 */
export function generateUserId() {
  if (isCryptoAvailable() && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  if (isCryptoAvailable()) {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return bufferToHex(bytes.buffer);
  }
  // Запасной вариант для окружений без Web Crypto (например, старые тесты).
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Сравнивает два хеша в постоянном времени.
 * Простая функция сравнения здесь достаточна: значение не секрет,
 * а timing-атаки на локальную демо-схему не применимы.
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Проверяет пароль пользователя по сохранённым соли и хешу.
 */
export async function verifyPassword(password, user) {
  if (!user || typeof user.salt !== 'string' || typeof user.passwordHash !== 'string') {
    return false;
  }
  const computed = await hashPassword(password, user.salt);
  return safeCompare(computed, user.passwordHash);
}

import { STORAGE_KEYS, STORAGE_VERSION, STORAGE_EVENT } from './constants';

/**
 * Модуль доступа к localStorage.
 *
 * Все обращения к хранилищу идут только через этот файл:
 *  - единый набор ключей;
 *  - безопасный разбор JSON с проверкой типа;
 *  - обработка «битых» данных;
 *  - версия формата данных.
 *
 * Если localStorage недоступен (приватный режим, отключённое хранилище,
 * тестовое окружение), модуль не бросает исключения, а сообщает об этом
 * через возвращаемые значения и колбэк onStorageError.
 */

/** Может ли окружение вообще работать с localStorage. */
export function isStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const probeKey = `${STORAGE_KEYS.settings}:probe`;
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return true;
  } catch (error) {
    return false;
  }
}

/** Общие обработчики ошибок хранилища (устанавливаются из приложения). */
const errorHandlers = new Set();

export function onStorageError(handler) {
  errorHandlers.add(handler);
  return () => errorHandlers.delete(handler);
}

function reportError(message, error) {
  // В консоли оставляем технические детали — они помогают при отладке,
  // пользователю показывается только понятное русское сообщение.
  console.error(`[storage] ${message}`, error);
  errorHandlers.forEach((handler) => handler(message, error));
}

/**
 * Читает и разбирает JSON из localStorage.
 * @returns {unknown} Разобранное значение или null, если данных нет/они повреждены.
 */
export function readJson(key, fallback = null) {
  if (!isStorageAvailable()) return fallback;

  let raw = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch (error) {
    reportError(`Не удалось прочитать «${key}»`, error);
    return fallback;
  }

  if (raw === null || raw === undefined) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch (error) {
    reportError(`Повреждённые данные в «${key}»`, error);
    return fallback;
  }
}

/**
 * Записывает значение в localStorage.
 * @returns {boolean} true, если запись действительно выполнена.
 */
export function writeJson(key, value) {
  if (!isStorageAvailable()) {
    reportError('Хранилище браузера недоступно', null);
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notifyChange(key);
    return true;
  } catch (error) {
    reportError(`Не удалось сохранить «${key}»`, error);
    return false;
  }
}

/** Удаляет ключ из хранилища. */
export function removeItem(key) {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(key);
    notifyChange(key);
    return true;
  } catch (error) {
    reportError(`Не удалось удалить «${key}»`, error);
    return false;
  }
}

function notifyChange(key) {
  try {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
  } catch (error) {
    // CustomEvent может быть недоступен в старых окружениях — это не критично.
    console.warn('[storage] не удалось отправить событие изменения', error);
  }
}


/* ------------------------------------------------------------------ */
/* Пользователи                                                         */
/* ------------------------------------------------------------------ */

/**
 * Читает список демонстрационных учётных записей.
 * Формат: { version, users: [{ id, email, passwordHash, salt, createdAt }] }
 */
export function loadUsers() {
  const data = readJson(STORAGE_KEYS.users);
  if (!data || typeof data !== 'object') return { version: STORAGE_VERSION, users: [] };

  // Неизвестная (более новая) версия — не трогаем данные, но и не используем их.
  if (data.version !== STORAGE_VERSION) {
    if (typeof data.version === 'number' && data.version > STORAGE_VERSION) {
      reportError(
        'Данные аккаунтов сохранены в более новой версии приложения и не могут быть прочитаны',
        null,
      );
      return { version: STORAGE_VERSION, users: [] };
    }
    // Более старая версия — мягкая миграция: сохраняем пользователей как есть.
    const users = Array.isArray(data.users) ? data.users : [];
    return { version: STORAGE_VERSION, users: users.filter(isValidUser) };
  }

  const users = Array.isArray(data.users) ? data.users : [];
  return { version: STORAGE_VERSION, users: users.filter(isValidUser) };
}

/** Сохраняет список демонстрационных учётных записей. */
export function saveUsers(users) {
  return writeJson(STORAGE_KEYS.users, { version: STORAGE_VERSION, users });
}

/** Проверяет, что структура записи пользователя корректна. */
export function isValidUser(user) {
  return (
    user &&
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    user.id.length > 0 &&
    typeof user.email === 'string' &&
    typeof user.passwordHash === 'string' &&
    typeof user.salt === 'string'
  );
}


/* ------------------------------------------------------------------ */
/* Сессия                                                               */
/* ------------------------------------------------------------------ */

/**
 * Читает текущую сессию.
 * В сессии хранится только идентификатор пользователя — никаких паролей и хешей.
 */
export function loadSession() {
  const data = readJson(STORAGE_KEYS.session);
  if (!data || typeof data !== 'object') return null;

  const { version, userId } = data;
  if (typeof version === 'number' && version > STORAGE_VERSION) {
    reportError('Сессия сохранена в более новой версии приложения', null);
    return null;
  }
  if (typeof userId !== 'string' || userId.length === 0) return null;

  return { userId };
}

/** Сохраняет идентификатор текущего пользователя. */
export function saveSession(userId) {
  return writeJson(STORAGE_KEYS.session, { version: STORAGE_VERSION, userId });
}

/** Удаляет сессию (выход из аккаунта). */
export function clearSession() {
  return removeItem(STORAGE_KEYS.session);
}


/* ------------------------------------------------------------------ */
/* Прогресс                                                             */
/* ------------------------------------------------------------------ */

/**
 * Читает прогресс всех пользователей.
 * Формат: { version, progress: { [userId]: { completedGames, completedTasks, stats } } }
 */
export function loadProgress() {
  const data = readJson(STORAGE_KEYS.progress);
  if (!data || typeof data !== 'object') return { version: STORAGE_VERSION, progress: {} };

  if (typeof data.version === 'number' && data.version > STORAGE_VERSION) {
    reportError(
      'Данные прогресса сохранены в более новой версии приложения и не могут быть прочитаны',
      null,
    );
    return { version: STORAGE_VERSION, progress: {} };
  }

  const raw = data.progress && typeof data.progress === 'object' ? data.progress : {};
  const progress = {};

  Object.keys(raw).forEach((userId) => {
    const entry = raw[userId];
    if (!entry || typeof entry !== 'object') return;
    progress[userId] = normalizeUserProgress(entry);
  });

  return { version: STORAGE_VERSION, progress };
}

/** Приводит запись прогресса к безопасной структуре. */
export function normalizeUserProgress(entry) {
  const completedGames = Array.isArray(entry.completedGames)
    ? entry.completedGames.filter((slug) => typeof slug === 'string')
    : [];

  const completedTasks = {};
  if (entry.completedTasks && typeof entry.completedTasks === 'object') {
    Object.keys(entry.completedTasks).forEach((slug) => {
      const ids = entry.completedTasks[slug];
      if (Array.isArray(ids)) {
        completedTasks[slug] = ids.filter((id) => typeof id === 'number');
      } else {
        completedTasks[slug] = [];
      }
    });
  }

  const stats = {};
  if (entry.stats && typeof entry.stats === 'object') {
    Object.keys(entry.stats).forEach((slug) => {
      const gameStats = entry.stats[slug];
      if (!gameStats || typeof gameStats !== 'object') return;
      stats[slug] = {
        gamesPlayed: toNonNegativeInt(gameStats.gamesPlayed),
        gamesWon: toNonNegativeInt(gameStats.gamesWon),
        bestScore: toNonNegativeInt(gameStats.bestScore),
      };
    });
  }

  return { completedGames, completedTasks, stats };
}

/* ------------------------------------------------------------------ */
/* Настройки                                                            */
/* ------------------------------------------------------------------ */

/** Читает настройки приложения. */
export function loadSettings() {
  const data = readJson(STORAGE_KEYS.settings);
  if (!data || typeof data !== 'object') return {};
  if (typeof data.version === 'number' && data.version > STORAGE_VERSION) return {};
  const { version, ...settings } = data;
  return settings;
}

/** Сохраняет настройки приложения. */
export function saveSettings(settings) {
  return writeJson(STORAGE_KEYS.settings, { version: STORAGE_VERSION, ...settings });
}


function toNonNegativeInt(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
}

/** Сохраняет прогресс всех пользователей целиком. */
export function saveProgress(progress) {
  return writeJson(STORAGE_KEYS.progress, { version: STORAGE_VERSION, progress });
}


/* ------------------------------------------------------------------ */
/* Прогресс курса                                                     */
/* ------------------------------------------------------------------ */

/**
 * Читает прогресс вводного курса.
 * Формат: { version, course: { [userId]: { completedTasks: string[] } } }
 *
 * Идентификатор задания — строка вида «lessonSlug/taskId».
 */
export function loadCourseProgress() {
  const data = readJson(STORAGE_KEYS.courseProgress);
  if (!data || typeof data !== 'object') return { version: STORAGE_VERSION, course: {} };

  if (typeof data.version === 'number' && data.version > STORAGE_VERSION) {
    reportError(
      'Данные прогресса курса сохранены в более новой версии приложения и не могут быть прочитаны',
      null,
    );
    return { version: STORAGE_VERSION, course: {} };
  }

  const raw = data.course && typeof data.course === 'object' ? data.course : {};
  const course = {};

  Object.keys(raw).forEach((userId) => {
    const entry = raw[userId];
    if (!entry || typeof entry !== 'object') return;

    const ids = Array.isArray(entry.completedTasks)
      ? entry.completedTasks.filter((id) => typeof id === 'string')
      : [];

    course[userId] = { completedTasks: ids };
  });

  return { version: STORAGE_VERSION, course };
}

/** Сохраняет прогресс курса для всех пользователей. */
export function saveCourseProgress(course) {
  return writeJson(STORAGE_KEYS.courseProgress, { version: STORAGE_VERSION, course });
}

/**
 * Централизованные ключи и версия формата данных в localStorage.
 * Все ключи уникальны для проекта, чтобы не пересекаться с другими приложениями.
 */
export const STORAGE_KEYS = {
  users: 'kod-v-igre:users',
  session: 'kod-v-igre:session',
  progress: 'kod-v-igre:progress',
  settings: 'kod-v-igre:settings',
  courseProgress: 'kod-v-igre:course-progress',
};

/**
 * Версия формата хранимых данных.
 * При изменении структуры версия повышается, а данные мигрируются или
 * корректно отбрасываются — прогресс не затирается молча.
 */
export const STORAGE_VERSION = 1;

/** Уровни сложности и их названия. */
export const DIFFICULTY_LABELS = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Высокая',
};

export const DIFFICULTY_VALUES = ['easy', 'medium', 'hard'];

/** Правила завершения задания: ручная отметка или автоматическая проверка. */
export const COMPLETION_MODE = {
  MANUAL: 'manual',
  AUTO: 'auto',
};

/** Событие для оповещения вкладок о смене темы/настроек. */
export const STORAGE_EVENT = 'kod-v-igre:storage-change';

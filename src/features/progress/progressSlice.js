import { createSlice } from '@reduxjs/toolkit';
import { loadProgress, saveProgress } from '../../utils/storage';
import { games, getGameBySlug } from '../../data/games';

const initialState = {
  completedGames: [],
  completedTasks: {},
  stats: {},
  loading: false,
  error: null,
  storageWarning: null,
};

/** Возвращает запись прогресса пользователя в нормализованном виде. */
export function getEmptyUserProgress() {
  return { completedGames: [], completedTasks: {}, stats: {} };
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    /** Прогресс загружен из хранилища. */
    progressLoaded(state, action) {
      const progress = action.payload || getEmptyUserProgress();
      state.completedGames = progress.completedGames || [];
      state.completedTasks = progress.completedTasks || {};
      state.stats = progress.stats || {};
      state.loading = false;
      state.error = null;
    },

    /** Ошибка загрузки или сохранения прогресса. */
    progressError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /** Предупреждение: сохранение в localStorage не удалось. */
    storageWarningSet(state, action) {
      state.storageWarning = action.payload;
    },

    /** Прогресс очищен (выход из аккаунта). */
    progressReset() {
      return getEmptyUserProgress();
    },
  },
});

export const { progressLoaded, progressError, storageWarningSet, progressReset } =
  progressSlice.actions;

/**
 * Загружает прогресс конкретного пользователя из localStorage.
 * @param {string} userId Идентификатор пользователя.
 */
export const loadUserProgress = (userId) => (dispatch) => {
  if (!userId) {
    dispatch(progressLoaded(getEmptyUserProgress()));
    return;
  }

  try {
    const { progress } = loadProgress();
    dispatch(progressLoaded(progress[userId] || getEmptyUserProgress()));
  } catch (error) {
    console.error('[progress] не удалось загрузить прогресс', error);
    dispatch(progressError('Не удалось загрузить сохранённый прогресс'));
  }
};

/**
 * Сохраняет текущий прогресс пользователя в localStorage.
 * Данные других пользователей не затрагиваются: обновляется только
 * запись с идентификатором userId.
 */
export const persistProgress = (userId, progress) => (dispatch) => {
  if (!userId) return false;

  try {
    const { progress: allProgress } = loadProgress();
    const next = { ...allProgress, [userId]: progress };
    const saved = saveProgress(next);
    if (!saved) {
      dispatch(
        storageWarningSet(
          'Не удалось сохранить прогресс: браузер запретил доступ к хранилищу. Изменения останутся только до перезагрузки страницы.',
        ),
      );
    }
    return saved;
  } catch (error) {
    console.error('[progress] не удалось сохранить прогресс', error);
    dispatch(storageWarningSet('Не удалось сохранить прогресс. Попробуйте ещё раз.'));
    return false;
  }
};


/**
 * Отмечает игру как пройденную.
 * Игра считается пройденной только по реальному игровому событию
 * (победа или выполнение задания), а не просто за её открытие.
 */
export const markGameCompleted = ({ userId, slug, progress, won }) => (dispatch) => {
  const game = getGameBySlug(slug);
  if (!game) return;

  const completedGames = progress.completedGames.includes(slug)
    ? progress.completedGames
    : [...progress.completedGames, slug];

  const previousStats = progress.stats[slug] || { gamesPlayed: 0, gamesWon: 0, bestScore: 0 };
  const stats = {
    ...progress.stats,
    [slug]: {
      ...previousStats,
      gamesPlayed: previousStats.gamesPlayed + 1,
      gamesWon: previousStats.gamesWon + (won ? 1 : 0),
    },
  };

  const nextProgress = { ...progress, completedGames, stats };
  dispatch(progressLoaded(nextProgress));
  dispatch(persistProgress(userId, nextProgress));
};

/**
 * Переключает статус практического задания (отметка вручную).
 * Задание считается выполненным только для текущего пользователя.
 */
export const toggleTask = ({ userId, slug, taskId, progress }) => (dispatch) => {
  const currentTasks = progress.completedTasks[slug] || [];
  const isDone = currentTasks.includes(taskId);

  const taskIds = isDone
    ? currentTasks.filter((id) => id !== taskId)
    : [...currentTasks, taskId];

  const completedTasks = { ...progress.completedTasks, [slug]: taskIds };
  const nextProgress = { ...progress, completedTasks };
  dispatch(progressLoaded(nextProgress));
  dispatch(persistProgress(userId, nextProgress));
};

/**
 * Обновляет статистику игры (счёт, лучший результат) без изменения
 * списка завершённых игр.
 */
export const updateGameStats = ({ userId, slug, progress, bestScore }) => (dispatch) => {
  const previousStats = progress.stats[slug] || { gamesPlayed: 0, gamesWon: 0, bestScore: 0 };
  const stats = {
    ...progress.stats,
    [slug]: {
      ...previousStats,
      bestScore: Math.max(previousStats.bestScore || 0, bestScore || 0),
    },
  };

  const nextProgress = { ...progress, stats };

  dispatch(progressLoaded(nextProgress));
  dispatch(persistProgress(userId, nextProgress));
};

/** Селектор: прогресс текущего пользователя в удобном виде. */
export const selectProgress = (state) => ({
  completedGames: state.progress.completedGames,
  completedTasks: state.progress.completedTasks,
  stats: state.progress.stats,
});

/** Селектор: общий процент пройденных игр (из реально сохранённых данных). */
export const selectGamesProgressPercent = (state) => {
  if (games.length === 0) return 0;
  return Math.round((state.progress.completedGames.length / games.length) * 100);
};

/** Селектор: общий процент выполненных заданий. */
export const selectTasksProgressPercent = (state) => {
  const totalTasks = games.reduce((sum, game) => sum + game.tasks.length, 0);
  if (totalTasks === 0) return 0;

  const doneTasks = Object.values(state.progress.completedTasks).reduce(
    (sum, ids) => sum + (Array.isArray(ids) ? ids.length : 0),
    0,
  );

  return Math.round((doneTasks / totalTasks) * 100);
};

/** Селектор: количество выполненных заданий. */
export const selectCompletedTasksCount = (state) =>
  Object.values(state.progress.completedTasks).reduce(
    (sum, ids) => sum + (Array.isArray(ids) ? ids.length : 0),
    0,
  );

/** Селектор: статистика по конкретной игре. */
export const selectGameStats = (state, slug) =>
  state.progress.stats[slug] || { gamesPlayed: 0, gamesWon: 0, bestScore: 0 };

export default progressSlice.reducer;

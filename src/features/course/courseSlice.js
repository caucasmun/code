import { createSlice } from '@reduxjs/toolkit';
import { loadCourseProgress, saveCourseProgress } from '../../utils/storage';

const initialState = {
  completedTasks: [],
  loading: false,
  error: null,
  storageWarning: null,
};

/**
 * Слайс прогресса вводного курса.
 *
 * Идентификатор выполненного задания — строка «lessonSlug/taskId».
 * Прогресс сохраняется отдельно от прогресса игр, чтобы не смешивать
 * две независимые шкалы выполнения.
 */
const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    /** Прогресс курса загружен из хранилища. */
    courseProgressLoaded(state, action) {
      const completedTasks = Array.isArray(action.payload) ? action.payload : [];
      state.completedTasks = completedTasks;
      state.loading = false;
      state.error = null;
    },

    /** Ошибка загрузки или сохранения прогресса курса. */
    courseProgressError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /** Предупреждение: сохранить прогресс курса не удалось. */
    courseStorageWarningSet(state, action) {
      state.storageWarning = action.payload;
    },

    /** Прогресс курса очищен (выход из аккаунта). */
    courseProgressReset() {
      return { completedTasks: [], loading: false, error: null, storageWarning: null };
    },
  },
});

export const { courseProgressLoaded, courseProgressError, courseStorageWarningSet, courseProgressReset } =
  courseSlice.actions;

/**
 * Загружает прогресс курса конкретного пользователя.
 * @param {string} userId Идентификатор пользователя.
 */
export const loadCourseUserProgress = (userId) => (dispatch) => {
  if (!userId) {
    dispatch(courseProgressLoaded([]));
    return;
  }

  try {
    const { course } = loadCourseProgress();
    dispatch(courseProgressLoaded(course[userId] ? course[userId].completedTasks : []));
  } catch (error) {
    console.error('[course] не удалось загрузить прогресс', error);
    dispatch(courseProgressError('Не удалось загрузить сохранённый прогресс курса'));
  }
};

/**
 * Сохраняет прогресс курса пользователя.
 * Данные других пользователей не затрагиваются.
 */
export const persistCourseProgress = (userId, completedTasks) => (dispatch) => {
  if (!userId) return false;

  try {
    const { course } = loadCourseProgress();
    const saved = saveCourseProgress({ ...course, [userId]: { completedTasks } });

    if (!saved) {
      dispatch(
        courseStorageWarningSet(
          'Не удалось сохранить прогресс курса: браузер запретил доступ к хранилищу. Изменения останутся только до перезагрузки страницы.',
        ),
      );
    }

    return saved;
  } catch (error) {
    console.error('[course] не удалось сохранить прогресс', error);
    dispatch(courseStorageWarningSet('Не удалось сохранить прогресс курса. Попробуйте ещё раз.'));
    return false;
  }
};

/**
 * Отмечает задание курса выполненным или снимает отметку.
 * Задание считается выполненным только после успешной проверки кода.
 */
export const toggleCourseTask = ({ userId, taskId, completedTasks }) => (dispatch) => {
  const isDone = completedTasks.includes(taskId);

  const nextTasks = isDone
    ? completedTasks.filter((id) => id !== taskId)
    : [...completedTasks, taskId];

  dispatch(courseProgressLoaded(nextTasks));
  dispatch(persistCourseProgress(userId, nextTasks));
};

/** Селектор: количество выполненных заданий курса. */
export const selectCourseCompletedCount = (state) => state.course.completedTasks.length;

export default courseSlice.reducer;

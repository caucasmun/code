import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCourseTask } from '../features/course/courseSlice';

/**
 * Хук для работы с прогрессом вводного курса.
 *
 * Гость может проходить уроки и проверять код, но отметки сохраняются
 * только авторизованному пользователю.
 *
 * @param {string} lessonSlug Идентификатор урока.
 */
export default function useCourseProgress(lessonSlug) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const completedTasks = useSelector((state) => state.course.completedTasks);
  const storageWarning = useSelector((state) => state.course.storageWarning);

  const userId = user ? user.id : null;
  const canEdit = Boolean(userId);

  /** Отмечает задание урока выполненным (или снимает отметку). */
  const toggleTaskCompletion = useCallback(
    (taskId) => {
      if (!canEdit) return;
      dispatch(toggleCourseTask({ userId, taskId: `${lessonSlug}/${taskId}`, completedTasks }));
    },
    [dispatch, canEdit, userId, lessonSlug, completedTasks],
  );

  /** Проверяет, выполнено ли задание урока. */
  const isTaskCompleted = useCallback(
    (taskId) => completedTasks.includes(`${lessonSlug}/${taskId}`),
    [completedTasks, lessonSlug],
  );

  /** Идентификаторы выполненных заданий текущего урока. */
  const lessonCompletedIds = useMemo(
    () =>
      completedTasks
        .filter((id) => id.startsWith(`${lessonSlug}/`))
        .map((id) => id.slice(lessonSlug.length + 1)),
    [completedTasks, lessonSlug],
  );

  return {
    canEdit,
    isTaskCompleted,
    lessonCompletedIds,
    completedTasks,
    storageWarning,
    toggleTaskCompletion,
  };
}

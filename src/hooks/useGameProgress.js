import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markGameCompleted, toggleTask, updateGameStats } from '../features/progress/progressSlice';

/**
 * Хук для работы с прогрессом конкретной игры.
 *
 * Гость может играть, но прогресс сохраняется только авторизованному
 * пользователю — поэтому все действия проверяют наличие user.id.
 *
 * Колбэки мемоизированы: их идентичность не меняется при каждом рендере,
 * иначе игровые компоненты с таймерами перезапускали бы цикл заново.
 *
 * @param {string} slug Адресный идентификатор игры.
 */
export default function useGameProgress(slug) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const completedGames = useSelector((state) => state.progress.completedGames);
  const completedTasks = useSelector((state) => state.progress.completedTasks);
  const stats = useSelector((state) => state.progress.stats);

  const userId = user ? user.id : null;
  const canEdit = Boolean(userId);

  // Снимок прогресса для передачи в thunks-действия.
  const progress = useMemo(
    () => ({ completedGames, completedTasks, stats }),
    [completedGames, completedTasks, stats],
  );

  /** Отмечает игру как пройденную (после реального игрового события). */
  const reportGameCompleted = useCallback(
    (won = true) => {
      if (!canEdit) return;
      dispatch(markGameCompleted({ userId, slug, progress, won }));
    },
    [dispatch, canEdit, userId, slug, progress],
  );

  /** Обновляет лучший результат (счёт) без изменения списка завершённых игр. */
  const reportScore = useCallback(
    (bestScore) => {
      if (!canEdit) return;
      dispatch(updateGameStats({ userId, slug, progress, bestScore }));
    },
    [dispatch, canEdit, userId, slug, progress],
  );

  /** Переключает отметку выполнения практического задания. */
  const toggleTaskCompletion = useCallback(
    (taskId) => {
      if (!canEdit) return;
      dispatch(toggleTask({ userId, slug, taskId, progress }));
    },
    [dispatch, canEdit, userId, slug, progress],
  );

  return {
    canEdit,
    isCompleted: completedGames.includes(slug),
    completedTaskIds: completedTasks[slug] || [],
    gameStats: stats[slug] || { gamesPlayed: 0, gamesWon: 0, bestScore: 0 },
    reportGameCompleted,
    reportScore,
    toggleTaskCompletion,
  };
}

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { games, TOTAL_GAMES, TOTAL_TASKS } from '../data/games';
import {
  selectCompletedTasksCount,
  selectGamesProgressPercent,
  selectTasksProgressPercent,
} from '../features/progress/progressSlice';

/**
 * Страница «Мой прогресс».
 *
 * Доступна только авторизованным пользователям — гостя сюда
 * отправляет ProtectedRoute.
 */
export default function ProgressPage() {
  const user = useSelector((state) => state.auth.user);
  const completedGames = useSelector((state) => state.progress.completedGames);
  const completedTasks = useSelector((state) => state.progress.completedTasks);
  const stats = useSelector((state) => state.progress.stats);
  const storageWarning = useSelector((state) => state.progress.storageWarning);

  const gamesPercent = useSelector(selectGamesProgressPercent);
  const tasksPercent = useSelector(selectTasksProgressPercent);
  const tasksDone = useSelector(selectCompletedTasksCount);

  useEffect(() => {
    document.title = 'Мой прогресс — Код в игре';
  }, []);

  return (
    <div className="progress-page">
      <header className="progress-page__header">
        <h1>Мой прогресс</h1>
        {user ? <p className="progress-page__subtitle">Аккаунт: {user.email}</p> : null}
      </header>

      {storageWarning ? (
        <p className="alert alert--warning" role="alert">
          {storageWarning}
        </p>
      ) : null}

      <section className="progress-page__summary" aria-label="Сводка прогресса">
        <div className="progress-page__card">
          <h2 className="progress-page__card-title">Пройдено игр</h2>
          <p className="progress-page__card-value">
            {completedGames.length} <span>/ {TOTAL_GAMES}</span>
          </p>
          <ProgressBar value={completedGames.length} max={TOTAL_GAMES} label="Игры" />
        </div>

        <div className="progress-page__card">
          <h2 className="progress-page__card-title">Выполнено заданий</h2>
          <p className="progress-page__card-value">
            {tasksDone} <span>/ {TOTAL_TASKS}</span>
          </p>
          <ProgressBar value={tasksDone} max={TOTAL_TASKS} label="Задания" />
        </div>

        <div className="progress-page__card">
          <h2 className="progress-page__card-title">Общий процент</h2>
          <p className="progress-page__card-value">
            {gamesPercent}% <span>игр</span>
          </p>
          <ProgressBar value={gamesPercent} max={100} label="Процент" />
          <p className="progress-page__card-note">Заданий выполнено: {tasksPercent}%</p>
        </div>
      </section>

      <section className="progress-page__games" aria-labelledby="progress-games-title">
        <h2 id="progress-games-title" className="section-title">
          Игры
        </h2>

        <ul className="progress-list">
          {games.map((game) => {
            const isCompleted = completedGames.includes(game.slug);
            const doneTasks = (completedTasks[game.slug] || []).length;
            const gameStats = stats[game.slug] || { gamesPlayed: 0, gamesWon: 0, bestScore: 0 };

            return (
              <li key={game.slug} className="progress-list__item">
                <div className="progress-list__main">
                  <h3 className="progress-list__title">
                    <Link to={`/game/${game.slug}`}>{game.title}</Link>
                  </h3>
                  <p className="progress-list__meta">
                    {isCompleted ? 'Пройдена' : 'Ещё не пройдена'} · заданий {doneTasks}/
                    {game.tasks.length} · сыграно {gameStats.gamesPlayed} · побед{' '}
                    {gameStats.gamesWon} · лучший счёт {gameStats.bestScore}
                  </p>
                  <ProgressBar
                    value={doneTasks}
                    max={game.tasks.length}
                    label="Задания"
                  />
                </div>

                <Link to={`/game/${game.slug}`} className="button button--ghost button--small">
                  Открыть
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

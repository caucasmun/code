import { Link } from 'react-router-dom';
import { DIFFICULTY_LABELS } from '../utils/constants';

/** Значок сложности игры. */
export function DifficultyBadge({ difficulty }) {
  return (
    <span className={`badge badge--${difficulty}`}>{DIFFICULTY_LABELS[difficulty] || difficulty}</span>
  );
}

/**
 * Карточка игры в каталоге.
 */
export default function GameCard({ game, isCompleted = false, tasksDone = 0, tasksTotal = 0 }) {
  return (
    <article className="game-card">
      <header className="game-card__header">
        <h3 className="game-card__title">
          <Link to={`/game/${game.slug}`}>{game.title}</Link>
        </h3>
        <DifficultyBadge difficulty={game.difficulty} />
      </header>

      <p className="game-card__description">{game.shortDescription}</p>

      <ul className="game-card__topics">
        {game.topics.map((topic) => (
          <li key={topic} className="tag">
            {topic}
          </li>
        ))}
      </ul>

      <footer className="game-card__footer">
        {isCompleted ? (
          <span className="game-card__status game-card__status--done">Пройдена</span>
        ) : (
          <span className="game-card__status">Заданий: {tasksDone}/{tasksTotal}</span>
        )}
        <Link to={`/game/${game.slug}`} className="button button--primary button--small">
          Открыть
        </Link>
      </footer>
    </article>
  );
}

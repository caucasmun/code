import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/games';

/**
 * Страница 404 — адрес не найден.
 */
export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Страница не найдена — Код в игре';
  }, []);

  return (
    <div className="not-found">
      <p className="not-found__code" aria-hidden="true">
        404
      </p>
      <h1 className="not-found__title">Такой страницы нет</h1>
      <p className="not-found__text">
        Возможно, адрес введён с ошибкой или игра была переименована. Выберите игру из каталога —
        там собраны все мини-игры.
      </p>

      <div className="not-found__actions">
        <Link to="/" className="button button--primary">
          На главную
        </Link>
      </div>

      <ul className="not-found__links">
        {games.map((game) => (
          <li key={game.slug}>
            <Link to={`/game/${game.slug}`}>{game.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

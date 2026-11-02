import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { setSearch, setDifficulty, resetFilters, selectFilteredGames } from '../features/games/gamesSlice';
import { DIFFICULTY_LABELS, DIFFICULTY_VALUES } from '../utils/constants';

/**
 * Главная страница — каталог игр с поиском и фильтром по сложности.
 */
export default function HomePage() {
  const dispatch = useDispatch();
  const filteredGames = useSelector(selectFilteredGames);
  const { search, difficulty } = useSelector((state) => state.games);
  const completedGames = useSelector((state) => state.progress.completedGames);
  const completedTasks = useSelector((state) => state.progress.completedTasks);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    document.title = 'Код в игре — изучение JavaScript через игры';
  }, []);

  const handleChooseGame = (slug) => {
    dispatch(setCurrentGame(slug));
    window.history.replaceState(null, '', `/game/${slug}`);
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">
          Учите <span className="hero-title__accent">JavaScript</span>, играя
        </h1>
        <p className="hero__text">
          JavaScript делает сайты живыми: считает корзину, показывает анимации и реагирует на клики.
          Изучите его с нуля на практике — прямо в браузере, без установки программ.
        </p>
        <div className="hero__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => handleChooseGame('tic-tac-toe')}
          >
            Выбрать игру
          </button>
          {!user ? (
            <Link to="/register" className="button button--ghost">
              Создать аккаунт
            </Link>
          ) : (
            <Link to="/progress" className="button button--ghost">
              Мой прогресс
            </Link>
          )}
        </div>
      </section>

      <section id="catalog" className="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title" className="section-title">
          Каталог игр
        </h2>

        <div className="catalog__filters">
          <div className="field field--search">
            <label className="field__label" htmlFor="catalog-search">
              Поиск по названию или теме
            </label>
            <input
              id="catalog-search"
              type="search"
              className="field__input"
              placeholder="Например: массивы"
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="catalog-difficulty">
              Сложность
            </label>
            <select
              id="catalog-difficulty"
              className="field__input"
              value={difficulty}
              onChange={handleDifficulty}
            >
              <option value="all">Любая</option>
              {DIFFICULTY_VALUES.map((value) => (
                <option key={value} value={value}>
                  {DIFFICULTY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="button button--ghost" onClick={handleReset}>
            Сбросить
          </button>
        </div>

        {filteredGames.length === 0 ? (
          <p className="catalog__empty">Ничего не найдено. Попробуйте изменить запрос или фильтр.</p>
        ) : (
          <div className="catalog__grid">
            {filteredGames.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
                isCompleted={completedGames.includes(game.slug)}
                tasksDone={(completedTasks[game.slug] || []).length}
                tasksTotal={game.tasks.length}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

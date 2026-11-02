import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentGame } from '../features/games/gamesSlice';
import { getGameBySlug } from '../data/games';
import CodeBreakdown from '../components/CodeBreakdown';
import TaskList from '../components/TaskList';
import ProgressBar from '../components/ProgressBar';
import { DifficultyBadge } from '../components/GameCard';
import useGameProgress from '../hooks/useGameProgress';
import GuessNumberGame from '../games/GuessNumberGame';
import RockPaperScissorsGame from '../games/RockPaperScissorsGame';
import HangmanGame from '../games/HangmanGame';
import TicTacToeGame from '../games/TicTacToeGame';
import SnakeGame from '../games/SnakeGame';

/**
 * Соответствие игровых компонентов адресным идентификаторам игр.
 */
const GAME_COMPONENTS = {
  'guess-number': GuessNumberGame,
  'rock-paper-scissors': RockPaperScissorsGame,
  hangman: HangmanGame,
  'tic-tac-toe': TicTacToeGame,
  snake: SnakeGame,
};

/**
 * Страница одной игры: сама игра, правила, задания и разбор кода.
 */
export default function GamePage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const game = getGameBySlug(slug);
  const user = useSelector((state) => state.auth.user);

  const {
    canEdit,
    isCompleted,
    completedTaskIds,
    gameStats,
    reportGameCompleted,
    reportScore,
    toggleTaskCompletion,
  } = useGameProgress(slug);

  useEffect(() => {
    if (game) {
      dispatch(setCurrentGame(slug));
      document.title = `${game.title} — Код в игре`;
    } else {
      document.title = 'Игра не найдена — Код в игре';
    }
  }, [dispatch, game, slug]);

  if (!game) {
    return <Navigate to="/not-found" replace />;
  }

  const GameComponent = GAME_COMPONENTS[game.slug];
  const tasksDone = completedTaskIds.length;
  const tasksTotal = game.tasks.length;

  const handleWin = () => {
    reportGameCompleted(true);
  };

  const handleScore = (score) => {
    reportScore(score);
  };

  const handleLose = () => {
    // Поражение от компьютера — прогресс не засчитывается,
    // сообщение о поражении уже отображается на доске.
  };

  return (
    <div className="game-page">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link to="/">Все игры</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{game.title}</span>
      </nav>

      <header className="game-page__header">
        <h1 className="game-page__title">{game.title}</h1>
        <DifficultyBadge difficulty={game.difficulty} />
      </header>

      <p className="game-page__description">{game.description}</p>

      <ul className="game-page__topics">
        {game.topics.map((topic) => (
          <li key={topic} className="tag">
            {topic}
          </li>
        ))}
      </ul>

      {game.rules && game.rules.length > 0 ? (
        <section className="game-page__rules" aria-labelledby="rules-title">
          <h2 id="rules-title" className="section-title">
            Правила
          </h2>
          <ol className="rules-list">
            {game.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          {game.completionHint ? (
            <p className="game-page__completion-hint">{game.completionHint}</p>
          ) : null}
        </section>
      ) : null}

      <section className="game-page__play" aria-labelledby="play-title">
        <h2 id="play-title" className="section-title">
          Игра
        </h2>
        {GameComponent ? (
          <GameComponent
            onWin={handleWin}
            onScore={handleScore}
            onLose={handleLose}
          />
        ) : (
          <p className="alert alert--info">Игра для этого адреса пока не реализована.</p>
        )}
      </section>

      <section className="game-page__tasks" aria-labelledby="tasks-title">
        <h2 id="tasks-title" className="section-title">
          Практические задания
        </h2>

        <ProgressBar value={tasksDone} max={tasksTotal} label="Выполнено заданий" />

        {!user ? (
          <p className="alert alert--info">
            Отмечать задания и сохранять прогресс можно только с аккаунтом.{' '}
            <Link to="/register">Зарегистрируйтесь</Link> — это займёт меньше минуты.
          </p>
        ) : null}

        <TaskList
          tasks={game.tasks}
          completedTaskIds={completedTaskIds}
          canEdit={canEdit}
          onToggle={toggleTaskCompletion}
        />
      </section>

      <CodeBreakdown breakdown={game.breakdown} fullCode={game.code} />

      {isCompleted ? (
        <p className="alert alert--success" role="status">
          Игра пройдена. Сыграйте ещё раз, чтобы улучшить результат: сыграно{' '}
          {gameStats.gamesPlayed}, побед {gameStats.gamesWon}, лучший счёт {gameStats.bestScore}.
        </p>
      ) : null}
    </div>
  );
}

import { useState } from 'react';
import {
  MOVES,
  MOVE_LABELS,
  ROUND_RESULT,
  MATCH_TARGET_WINS,
  MATCH_WINNER,
  determineResult,
  getRandomMove,
  createEmptyScore,
  applyRoundToScore,
  createEmptyMatch,
  playMatchRound,
} from '../utils/gameLogic/rockPaperScissorsLogic';

/** Эмодзи для каждого хода — так нагляднее, чем одни буквы. */
const MOVE_EMOJI = {
  rock: '✊',
  scissors: '✌️',
  paper: '✋',
};

const RESULT_MESSAGES = {
  [ROUND_RESULT.WIN]: 'Вы победили!',
  [ROUND_RESULT.LOSE]: 'Компьютер победил',
  [ROUND_RESULT.DRAW]: 'Ничья',
};

/** Подпись результата раунда для истории матча. */
const RESULT_LABELS = {
  [ROUND_RESULT.WIN]: 'победа',
  [ROUND_RESULT.LOSE]: 'поражение',
  [ROUND_RESULT.DRAW]: 'ничья',
};

/**
 * Игра «Камень, ножницы, бумага».
 *
 * Матч играется до первой победы в MATCH_TARGET_WINS раундов.
 * Общая статистика (победы, поражения, ничьи, серии) живёт отдельно
 * от счёта матча и не стирается при начале нового матча.
 */
export default function RockPaperScissorsGame({ onWin, onScore }) {
  const [match, setMatch] = useState(createEmptyMatch);
  const [stats, setStats] = useState(createEmptyScore);
  const [playerMove, setPlayerMove] = useState(null);
  const [computerMove, setComputerMove] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const matchFinished = Boolean(match.winner);

  const handleMove = (move) => {
    // Матч закончен — новые раунды не играются.
    if (matchFinished) return;

    const computer = getRandomMove(MOVES);
    const result = determineResult(move, computer);

    const nextMatch = playMatchRound(match, move, computer);
    const nextStats = applyRoundToScore(stats, result);

    setMatch(nextMatch);
    setStats(nextStats);
    setPlayerMove(move);
    setComputerMove(computer);
    setLastResult(result);

    // Игра засчитывается как пройденная уже после первой победы.
    if (result === ROUND_RESULT.WIN) {
      onWin?.(nextStats.wins);
    }
    // Лучший результат — общее число побед за всё время.
    onScore?.(nextStats.wins);
  };

  /** Новый матч: счёт матча и его история обнуляются, статистика сохраняется. */
  const handleNewMatch = () => {
    setMatch(createEmptyMatch());
    setPlayerMove(null);
    setComputerMove(null);
    setLastResult(null);
  };

  /** Полный сброс: обнуляются и матч, и общая статистика. */
  const handleReset = () => {
    handleNewMatch();
    setStats(createEmptyScore());
  };

  return (
    <div className="game game--rps">
      <div className="game__panel">
        <p className="game__hint-text">
          Выберите свой ход. Камень бьёт ножницы, ножницы бьют бумагу, бумага бьёт
          камень. Матч заканчивается, когда кто-то наберёт {MATCH_TARGET_WINS} побед.
        </p>

        <div className="rps__match">
          <div className="rps__match-score">
            <span className="rps__match-caption">Вы</span>
            <strong className="rps__match-value">{match.playerWins}</strong>
          </div>
          <span className="rps__match-target">до {MATCH_TARGET_WINS} побед</span>
          <div className="rps__match-score">
            <span className="rps__match-caption">Компьютер</span>
            <strong className="rps__match-value">{match.computerWins}</strong>
          </div>
        </div>

        {matchFinished ? (
          <p
            className={`alert ${
              match.winner === MATCH_WINNER.PLAYER ? 'alert--success' : 'alert--error'
            }`}
            role="status"
          >
            {match.winner === MATCH_WINNER.PLAYER
              ? 'Вы победили матч!'
              : 'Компьютер победил матч.'}{' '}
            Начните новый матч, чтобы сыграть ещё раз.
          </p>
        ) : null}

        <div className="rps__moves" role="group" aria-label="Выбор хода">
          {MOVES.map((move) => (
            <button
              key={move}
              type="button"
              className={`rps__move rps__move--${move}`}
              onClick={() => handleMove(move)}
              aria-label={MOVE_LABELS[move]}
              disabled={matchFinished}
            >
              <span className="rps__emoji" aria-hidden="true">
                {MOVE_EMOJI[move]}
              </span>
              <span className="rps__move-label">{MOVE_LABELS[move]}</span>
            </button>
          ))}
        </div>

        {lastResult ? (
          <div className={`rps__result rps__result--${lastResult}`} role="status">
            <p className="rps__round">
              Вы: <strong>{playerMove ? MOVE_EMOJI[playerMove] : ''}</strong>{' '}
              <span className="rps__versus">против</span> компьютера:{' '}
              <strong>{computerMove ? MOVE_EMOJI[computerMove] : ''}</strong>
            </p>
            <p
              className={`alert ${
                lastResult === ROUND_RESULT.WIN
                  ? 'alert--success'
                  : lastResult === ROUND_RESULT.LOSE
                    ? 'alert--error'
                    : 'alert--info'
              }`}
            >
              {RESULT_MESSAGES[lastResult]}
            </p>
          </div>
        ) : null}

        <div className="rps__score">
          <span>
            Победы: <strong>{stats.wins}</strong>
          </span>
          <span>
            Поражения: <strong>{stats.losses}</strong>
          </span>
          <span>
            Ничьи: <strong>{stats.draws}</strong>
          </span>
          <span>
            Серия побед: <strong>{stats.currentStreak}</strong>
          </span>
          <span>
            Лучшая серия: <strong>{stats.bestStreak}</strong>
          </span>
        </div>

        <div className="rps__actions">
          <button type="button" className="button button--primary" onClick={handleNewMatch}>
            Новый матч
          </button>
          <button type="button" className="button button--ghost" onClick={handleReset}>
            Сбросить статистику
          </button>
        </div>

        {match.history.length > 0 ? (
          <div className="game__history">
            <h3 className="game__subtitle">История последних раундов</h3>
            <ol className="history-list">
              {match.history.map((item) => (
                <li key={item.round} className="history-list__item">
                  <span className="history-list__number">Раунд {item.round}</span>
                  <span className="history-list__value">
                    {MOVE_LABELS[item.playerMove]} — {MOVE_LABELS[item.computerMove]}
                  </span>
                  <span className={`rps__history-result rps__history-result--${item.result}`}>
                    {RESULT_LABELS[item.result]}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
}

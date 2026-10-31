import { describe, it, expect } from 'vitest';
import {
  MOVES,
  ROUND_RESULT,
  MATCH_TARGET_WINS,
  MATCH_WINNER,
  HISTORY_LIMIT,
  applyRoundToScore,
  createEmptyScore,
  determineResult,
  getRandomMove,
  createEmptyMatch,
  getMatchWinner,
  isMatchFinished,
  playMatchRound,
} from './rockPaperScissorsLogic';

describe('determineResult', () => {
  it('камень бьёт ножницы', () => {
    expect(determineResult('rock', 'scissors')).toBe(ROUND_RESULT.WIN);
  });

  it('ножницы бьют бумагу', () => {
    expect(determineResult('scissors', 'paper')).toBe(ROUND_RESULT.WIN);
  });

  it('бумага бьёт камень', () => {
    expect(determineResult('paper', 'rock')).toBe(ROUND_RESULT.WIN);
  });

  it('одинаковые ходы дают ничью', () => {
    expect(determineResult('rock', 'rock')).toBe(ROUND_RESULT.DRAW);
  });

  it('проигрышный ход даёт поражение', () => {
    expect(determineResult('rock', 'paper')).toBe(ROUND_RESULT.LOSE);
  });
});

describe('getRandomMove', () => {
  it('возвращает один из допустимых ходов', () => {
    for (let i = 0; i < 20; i += 1) {
      expect(MOVES).toContain(getRandomMove());
    }
  });

  it('учитывает переданный набор ходов', () => {
    expect(getRandomMove(['only'])).toBe('only');
  });
});

describe('createEmptyScore', () => {
  it('создаёт счёт с нулями', () => {
    expect(createEmptyScore()).toEqual({
      wins: 0,
      losses: 0,
      draws: 0,
      bestStreak: 0,
      currentStreak: 0,
    });
  });
});

describe('applyRoundToScore', () => {
  it('считает победу и увеличивает серию', () => {
    const score = applyRoundToScore(createEmptyScore(), ROUND_RESULT.WIN);

    expect(score.wins).toBe(1);
    expect(score.currentStreak).toBe(1);
    expect(score.bestStreak).toBe(1);
  });

  it('обнуляет серию при поражении', () => {
    const start = { wins: 2, losses: 0, draws: 0, bestStreak: 2, currentStreak: 2 };
    const score = applyRoundToScore(start, ROUND_RESULT.LOSE);

    expect(score.losses).toBe(1);
    expect(score.currentStreak).toBe(0);
    expect(score.bestStreak).toBe(2);
  });

  it('считает ничью', () => {
    const score = applyRoundToScore(createEmptyScore(), ROUND_RESULT.DRAW);

    expect(score.draws).toBe(1);
    expect(score.wins).toBe(0);
  });

  it('не меняет исходный объект', () => {
    const start = createEmptyScore();
    applyRoundToScore(start, ROUND_RESULT.WIN);

    expect(start.wins).toBe(0);
  });
});

describe('createEmptyMatch', () => {
  it('создаёт матч с нулевым счётом и без победителя', () => {
    expect(createEmptyMatch()).toEqual({
      playerWins: 0,
      computerWins: 0,
      draws: 0,
      rounds: 0,
      winner: null,
      history: [],
    });
  });
});

describe('getMatchWinner', () => {
  it('до трёх побед победителя нет', () => {
    expect(getMatchWinner(2, 2)).toBeNull();
  });

  it('игрок побеждает при трёх победах', () => {
    expect(getMatchWinner(MATCH_TARGET_WINS, 1)).toBe(MATCH_WINNER.PLAYER);
  });

  it('компьютер побеждает при трёх победах', () => {
    expect(getMatchWinner(1, MATCH_TARGET_WINS)).toBe(MATCH_WINNER.COMPUTER);
  });
});

describe('playMatchRound', () => {
  it('считает победу игрока и раунд', () => {
    const match = playMatchRound(createEmptyMatch(), 'rock', 'scissors');

    expect(match.playerWins).toBe(1);
    expect(match.computerWins).toBe(0);
    expect(match.rounds).toBe(1);
    expect(match.winner).toBeNull();
  });

  it('считает поражение компьютера', () => {
    const match = playMatchRound(createEmptyMatch(), 'rock', 'paper');

    expect(match.computerWins).toBe(1);
    expect(match.playerWins).toBe(0);
  });

  it('считает ничью', () => {
    const match = playMatchRound(createEmptyMatch(), 'paper', 'paper');

    expect(match.draws).toBe(1);
    expect(match.playerWins).toBe(0);
    expect(match.computerWins).toBe(0);
  });

  it('объявляет игрока победителем матча на третьей победе', () => {
    let match = createEmptyMatch();
    match = playMatchRound(match, 'rock', 'scissors');
    match = playMatchRound(match, 'paper', 'rock');
    match = playMatchRound(match, 'scissors', 'paper');

    expect(match.playerWins).toBe(MATCH_TARGET_WINS);
    expect(match.winner).toBe(MATCH_WINNER.PLAYER);
    expect(isMatchFinished(match)).toBe(true);
  });

  it('объявляет компьютер победителем матча на третьей победе', () => {
    let match = createEmptyMatch();
    match = playMatchRound(match, 'rock', 'paper');
    match = playMatchRound(match, 'rock', 'paper');
    match = playMatchRound(match, 'rock', 'paper');

    expect(match.computerWins).toBe(MATCH_TARGET_WINS);
    expect(match.winner).toBe(MATCH_WINNER.COMPUTER);
  });

  it('не играет новые раунды после окончания матча', () => {
    let match = createEmptyMatch();
    match = playMatchRound(match, 'rock', 'scissors');
    match = playMatchRound(match, 'paper', 'rock');
    match = playMatchRound(match, 'scissors', 'paper');

    const afterFinish = playMatchRound(match, 'rock', 'scissors');

    expect(afterFinish).toBe(match);
    expect(afterFinish.rounds).toBe(3);
    expect(afterFinish.playerWins).toBe(MATCH_TARGET_WINS);
  });

  it('не меняет исходное состояние матча', () => {
    const start = createEmptyMatch();
    playMatchRound(start, 'rock', 'scissors');

    expect(start.rounds).toBe(0);
    expect(start.history).toHaveLength(0);
  });

  it('записывает ходы и результат в историю', () => {
    const match = playMatchRound(createEmptyMatch(), 'rock', 'scissors');

    expect(match.history).toEqual([
      { round: 1, playerMove: 'rock', computerMove: 'scissors', result: ROUND_RESULT.WIN },
    ]);
  });

  it('хранит в истории только последние раунды', () => {
    let match = createEmptyMatch();
    // Ничьи не заканчивают матч, поэтому история растёт без ограничений.
    for (let i = 0; i < HISTORY_LIMIT + 3; i += 1) {
      match = playMatchRound(match, 'rock', 'rock');
    }

    expect(match.rounds).toBe(HISTORY_LIMIT + 3);
    expect(match.history).toHaveLength(HISTORY_LIMIT);
    expect(match.history[0].round).toBe(4);
    expect(match.history[HISTORY_LIMIT - 1].round).toBe(HISTORY_LIMIT + 3);
  });

  it('нумерует раунды сквозняком по всему матчу', () => {
    let match = createEmptyMatch();
    match = playMatchRound(match, 'rock', 'scissors');
    match = playMatchRound(match, 'paper', 'paper');
    match = playMatchRound(match, 'scissors', 'paper');

    expect(match.history.map((item) => item.round)).toEqual([1, 2, 3]);
  });
});

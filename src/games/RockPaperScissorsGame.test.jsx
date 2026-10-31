import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import RockPaperScissorsGame from './RockPaperScissorsGame';
import {
  MOVES,
  MOVE_LABELS,
  MATCH_TARGET_WINS,
  HISTORY_LIMIT,
} from '../utils/gameLogic/rockPaperScissorsLogic';

/**
 * Подменяет случайный выбор компьютера: на каждый следующий ход
 * возвращается заранее заданная последовательность.
 */
function mockComputerMoves(moves) {
  let index = 0;
  const spy = vi.spyOn(Math, 'random').mockImplementation(() => {
    const move = moves[index % moves.length];
    index += 1;
    return MOVES.indexOf(move) / MOVES.length + 0.001;
  });
  return spy;
}

/** Кликает по кнопке хода игрока. */
function play(playerMove) {
  fireEvent.click(screen.getByRole('button', { name: MOVE_LABELS[playerMove] }));
}

/** Блок общей статистики. */
function statsPanel() {
  return document.querySelector('.rps__score');
}

describe('RockPaperScissorsGame', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('показывает счёт матча 0:0 в начале', () => {
    render(<RockPaperScissorsGame />);

    const scores = screen.getAllByText('0');
    expect(scores.length).toBeGreaterThan(0);
    expect(screen.getByText(`до ${MATCH_TARGET_WINS} побед`)).toBeInTheDocument();
  });

  it('считает победу игрока в счёте матча', () => {
    mockComputerMoves(['scissors']);
    render(<RockPaperScissorsGame />);

    play('rock');

    expect(screen.getByText('Вы победили!')).toBeInTheDocument();
  });

  it('заканчивает матч после трёх побед игрока и блокирует ходы', () => {
    mockComputerMoves(['scissors', 'rock', 'paper']);
    render(<RockPaperScissorsGame />);

    play('rock');
    play('paper');
    play('scissors');

    expect(screen.getByText(/Вы победили матч!/)).toBeInTheDocument();

    for (const move of MOVES) {
      expect(screen.getByRole('button', { name: MOVE_LABELS[move] })).toBeDisabled();
    }
  });

  it('заканчивает матч после трёх побед компьютера', () => {
    mockComputerMoves(['paper', 'paper', 'paper']);
    render(<RockPaperScissorsGame />);

    play('rock');
    play('rock');
    play('rock');

    expect(screen.getByText(/Компьютер победил матч\./)).toBeInTheDocument();
  });

  it('показывает историю последних раундов с ходами и результатом', () => {
    mockComputerMoves(['scissors', 'paper']);
    render(<RockPaperScissorsGame />);

    play('rock');
    play('rock');

    const history = screen.getByRole('list');
    expect(history).toHaveTextContent('Раунд 1');
    expect(history).toHaveTextContent('Камень — Ножницы');
    expect(history).toHaveTextContent('победа');
    expect(history).toHaveTextContent('Раунд 2');
    expect(history).toHaveTextContent('Камень — Бумага');
    expect(history).toHaveTextContent('поражение');
  });

  it('оставляет в истории только последние пять раундов', () => {
    // Ничьи не завершают матч, поэтому можно сыграть больше пяти раундов.
    mockComputerMoves(['rock']);
    render(<RockPaperScissorsGame />);

    for (let i = 0; i < HISTORY_LIMIT + 2; i += 1) {
      play('rock');
    }

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(HISTORY_LIMIT);
    // Номера раундов сквозные: показываются последние пять, начиная с третьего.
    expect(items[0]).toHaveTextContent('Раунд 3');
    expect(items[items.length - 1]).toHaveTextContent(`Раунд ${HISTORY_LIMIT + 2}`);
  });

  it('обнуляет счёт матча, но сохраняет общую статистику', () => {
    mockComputerMoves(['scissors', 'scissors']);
    render(<RockPaperScissorsGame />);

    play('rock');
    play('rock');

    fireEvent.click(screen.getByRole('button', { name: 'Новый матч' }));

    // История матча очищена.
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    // Счёт матча обнулён.
    expect(screen.getByText('до 3 побед')).toBeInTheDocument();
    // Общая статистика сохранена: две победы остаются.
    expect(screen.getByText('Победы:')).toBeInTheDocument();
    expect(statsPanel()).toHaveTextContent('Победы: 2');
    expect(statsPanel()).toHaveTextContent('Лучшая серия: 2');
  });

  it('полностью сбрасывает и матч, и статистику', () => {
    mockComputerMoves(['scissors']);
    render(<RockPaperScissorsGame />);

    play('rock');
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить статистику' }));

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('Вы победили!')).not.toBeInTheDocument();
  });

  it('уведомляет о победе и сообщает счёт', () => {
    mockComputerMoves(['scissors']);
    const onWin = vi.fn();
    const onScore = vi.fn();
    render(<RockPaperScissorsGame onWin={onWin} onScore={onScore} />);

    play('rock');

    expect(onWin).toHaveBeenCalledWith(1);
    expect(onScore).toHaveBeenCalledWith(1);
  });

  it('не вызывает onWin при поражении', () => {
    mockComputerMoves(['paper']);
    const onWin = vi.fn();
    render(<RockPaperScissorsGame onWin={onWin} />);

    play('rock');

    expect(onWin).not.toHaveBeenCalled();
  });
});
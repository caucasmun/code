import { useState } from 'react';
import {
  createInitialGuessNumberState,
  submitGuess,
  compareGuess,
  COMPARE_RESULT,
  MIN_NUMBER,
  MAX_NUMBER,
} from '../utils/gameLogic/guessNumberLogic';

/**
 * Игра «Угадай число».
 *
 * Вся игровая логика вынесена в utils/gameLogic/guessNumberLogic.js —
 * компонент только отображает состояние и передаёт ввод.
 */
export default function GuessNumberGame({ onWin, onScore }) {
  const [state, setState] = useState(() => createInitialGuessNumberState(MIN_NUMBER, MAX_NUMBER));
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const next = submitGuess(state, input);
    setState(next);
    setInput('');

    if (next.status === 'won') {
      // Количество попыток — результат игрока: чем меньше, тем лучше.
      onWin?.(next.attempts);
      onScore?.(next.attempts);
    }
  };

  const handleRestart = () => {
    setState(createInitialGuessNumberState(MIN_NUMBER, MAX_NUMBER));
    setInput('');
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const isWon = state.status === 'won';

  return (
    <div className="game game--guess-number">
      <div className="game__panel">
        <p className="game__hint-text">
          Компьютер загадал целое число от {state.min} до {state.max}. Попыток:{' '}
          <strong>{state.attempts}</strong>
        </p>

        {state.error ? (
          <p className="alert alert--error" role="alert">
            {state.error}
          </p>
        ) : null}

        {isWon ? (
          <p className="alert alert--success" role="status">
            Верно! Это число {state.secret}. Вы угадали за {state.attempts}{' '}
            {state.attempts === 1 ? 'попытку' : 'попыток'}.
          </p>
        ) : state.hint ? (
          <p className="alert alert--info" role="status">
            {state.hint}
          </p>
        ) : null}

        <form className="game__form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="guess-input">
            Ваше предположение
          </label>
          <input
            id="guess-input"
            className="field__input game__input"
            type="number"
            inputMode="numeric"
            min={state.min}
            max={state.max}
            value={input}
            onChange={handleInputChange}
            placeholder="Введите число"
            disabled={isWon}
            autoFocus
          />
          <button type="submit" className="button button--primary" disabled={isWon}>
            Проверить
          </button>
          <button type="button" className="button button--ghost" onClick={handleRestart}>
            Новая игра
          </button>
        </form>

        {state.history.length > 0 ? (
          <div className="game__history">
            <h3 className="game__subtitle">История попыток</h3>
            <ol className="history-list">
              {state.history.map((item, index) => (
                <li key={`${item.guess}-${index}`} className="history-list__item">
                  <span className="history-list__number">Попытка {index + 1}</span>
                  <span className="history-list__value">{item.guess}</span>
                  <span className="history-list__result">
                    {item.result === COMPARE_RESULT.HIGHER
                      ? 'Загаданное число больше'
                      : item.result === COMPARE_RESULT.LOWER
                        ? 'Загаданное число меньше'
                        : 'Верно'}
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

/** Экспорт для тестов: сравнение чисел используется и вне компонента. */
export { compareGuess };

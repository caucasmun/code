import { useState } from 'react';
import {
  RUSSIAN_ALPHABET,
  DEFAULT_MAX_MISTAKES,
  createInitialHangmanState,
  guessLetter,
  getMaskedWord,
} from '../utils/gameLogic/hangmanLogic';
import HANGMAN_WORDS from '../data/words';

/**
 * Игра «Виселица».
 */
export default function HangmanGame({ onWin, onScore }) {
  const [state, setState] = useState(() =>
    createInitialHangmanState(HANGMAN_WORDS, DEFAULT_MAX_MISTAKES),
  );

  const masked = getMaskedWord(state.word, state.guessedLetters);
  const isFinished = state.status !== 'playing';

  const handleGuess = (letter) => {
    const next = guessLetter(state, letter);
    setState(next);

    if (next.status === 'won') {
      // Результат — количество оставшихся попыток: чем больше, тем лучше.
      onWin?.(next.maxMistakes - next.mistakes);
      onScore?.(next.maxMistakes - next.mistakes);
    }
  };

  const handleRestart = () => {
    setState(createInitialHangmanState(HANGMAN_WORDS, DEFAULT_MAX_MISTAKES));
  };

  const getLetterState = (letter) => {
    if (state.guessedLetters.includes(letter)) return 'guessed';
    if (state.wrongLetters.includes(letter)) return 'wrong';
    return 'idle';
  };

  return (
    <div className="game game--hangman">
      <div className="game__panel">
        <p className="game__hint-text">
          Ошибок: <strong>{state.mistakes}</strong> из {state.maxMistakes}
        </p>

        {state.message ? (
          <p
            className={`alert ${
              state.status === 'won'
                ? 'alert--success'
                : state.status === 'lost'
                  ? 'alert--error'
                  : 'alert--info'
            }`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}

        {state.status === 'lost' ? (
          <p className="alert alert--info">Загаданное слово: {state.word}</p>
        ) : null}

        <div className="hangman__word" aria-label={`Загаданное слово: ${masked.join(' ')}`}>
          {masked.map((letter, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={`${letter}-${index}`} className="hangman__letter">
              {letter}
            </span>
          ))}
        </div>

        <div className="hangman__keyboard" role="group" aria-label="Буквы алфавита">
          {RUSSIAN_ALPHABET.map((letter) => {
            const letterState = getLetterState(letter);
            return (
              <button
                key={letter}
                type="button"
                className={`hangman__key hangman__key--${letterState}`}
                onClick={() => handleGuess(letter)}
                disabled={letterState !== 'idle' || isFinished}
                aria-label={`Буква ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <button type="button" className="button button--ghost" onClick={handleRestart}>
          Новая игра
        </button>
      </div>
    </div>
  );
}

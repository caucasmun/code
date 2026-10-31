import { formatResult } from '../utils/codeChecker';

/**
 * Панель результатов проверки кода.
 *
 * Показывает три состояния:
 *  - ожидание (код ещё не проверяли);
 *  - ошибки: синтаксические, runtime или проваленные тесты;
 *  - успех: все тесты пройдены.
 *
 * @param {object} result Результат проверки.
 * @param {boolean} isChecking Идёт ли проверка.
 * @param {string[]} hints Подсказки к заданию.
 */
export default function CodeFeedback({ result, isChecking = false, hints = [] }) {
  if (isChecking) {
    return (
      <div className="feedback feedback--pending" role="status" aria-live="polite">
        <span className="feedback__spinner" aria-hidden="true" />
        <p>Проверяем код…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="feedback feedback--idle">
        <p className="feedback__title">Код ещё не проверялся</p>
        <p className="feedback__text">
          Напишите решение и нажмите «Проверить». Чтобы просто посмотреть, как работает код, используйте кнопку «Запустить». Мы покажем, где именно ошибка, и дадим подсказку.
        </p>
      </div>
    );
  }

  if (result.passed) {
    return (
      <div className="feedback feedback--success" role="status">
        <p className="feedback__title">Всё верно! 🎉</p>
        <p className="feedback__text">
          Пройдено тестов: {result.tests.length}. Решение можно считать готовым.
        </p>

        {result.output && result.output.length > 0 ? (
          <div className="feedback__console">
            <p className="feedback__console-title">Вывод console.log:</p>
            <pre>{result.output.join('\n')}</pre>
          </div>
        ) : null}

        {hints.length > 0 ? (
          <details className="feedback__hints">
            <summary>Что можно улучшить</summary>
            <ul>
              {hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    );
  }

  const hasFatal = Boolean(result.fatal);
  const failedTests = (result.tests || []).filter((test) => !test.ok);

  return (
    <div className="feedback feedback--error" role="alert">
      <p className="feedback__title">
        {hasFatal ? 'Код не запустился' : `Не все тесты пройдены (${result.tests.length - failedTests.length} из ${result.tests.length})`}
      </p>

      {result.errors && result.errors.length > 0 ? (
        <ul className="feedback__errors">
          {result.errors.map((error, index) => (
            <li key={`${error.title}-${index}`} className="feedback__error">
              <p className="feedback__error-title">
                {error.title}
                {error.line ? (
                  <span className="feedback__error-position">
                    {' '}— строка {error.line}
                    {error.column ? `, столбец ${error.column}` : ''}
                  </span>
                ) : null}
              </p>
              <p className="feedback__error-message">{error.message}</p>
              <p className="feedback__error-hint">{error.hint}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {failedTests.length > 0 ? (
        <ul className="feedback__tests">
          {failedTests.map((test) => (
            <li key={test.index} className="feedback__test feedback__test--failed">
              <p className="feedback__test-title">
                {test.ok ? '✓' : '✗'} {test.description}
              </p>

              <p className="feedback__test-detail">
                Аргументы: <code>{formatResult(test.args)}</code>
              </p>

              {test.error ? (
                <p className="feedback__test-detail">
                  Ошибка: <code>{test.error}</code>
                </p>
              ) : (
                <p className="feedback__test-detail">
                  Ожидалось: <code>{formatResult(test.expected)}</code> · получено:{' '}
                  <code>{formatResult(test.actual)}</code>
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {result.output && result.output.length > 0 ? (
        <div className="feedback__console">
          <p className="feedback__console-title">Вывод console.log:</p>
          <pre>{result.output.join('\n')}</pre>
        </div>
      ) : null}

      {hints.length > 0 ? (
        <details className="feedback__hints" open={hasFatal}>
          <summary>Подсказки</summary>
          <ul>
            {hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

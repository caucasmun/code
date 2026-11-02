import { useState } from 'react';
import CodeEditor from './CodeEditor';
import CodeFeedback from './CodeFeedback';
import useCodeCheck from '../hooks/useCodeCheck';

/**
 * Блок практики: условие задачи, редактор кода и проверка.
 *
 * Используется и в играх, и в курсе — отличается только источник задания.
 *
 * @param {object} task Задание с тестами.
 * @param {boolean} [isCompleted] Отмечено ли задание как выполненное.
 * @param {function} [onSolved] Вызывается, когда все тесты пройдены.
 */
export default function CodeTask({ task, isCompleted = false, onSolved }) {
  const starterCode = task.starterCode || '';
  const { code, setCode, result, isChecking, errorLine, hints, check, run, runResult, isRunning, reset } = useCodeCheck(
    task,
    starterCode,
  );

  const [solvedNotified, setSolvedNotified] = useState(false);

  const handleCheck = async () => {
    const checkResult = await check();

    if (checkResult && checkResult.passed && !solvedNotified) {
      setSolvedNotified(true);
      if (onSolved) onSolved(task.id);
    }
  };

  const handleRun = async () => {
    await run();
  };

  const handleReset = () => {
    reset();
    setSolvedNotified(false);
  };

  return (
    <div className="practice">
      <div className="practice__description">
        <h4 className="practice__title">{task.title}</h4>
        <p className="practice__text">{task.description}</p>

        {task.criteria ? (
          <p className="practice__criteria">
            <strong>Критерий: </strong>
            {task.criteria}
          </p>
        ) : null}

        {task.example ? (
          <div className="practice__example">
            <p className="practice__example-title">Пример</p>
            <pre className="practice__example-body">{task.example}</pre>
          </div>
        ) : null}
      </div>

      <div className="practice__workspace">
        <CodeEditor
          value={code}
          onChange={setCode}
          errorLine={errorLine}
          label={`Редактор кода: ${task.title}`}
        />

        <div className="practice__actions">
          <button
            type="button"
            className="button button--ghost"
            onClick={handleRun}
            disabled={isRunning || isCompleted}
          >
            {isRunning ? 'Выполняем…' : 'Запустить'}
          </button>

          <button
            type="button"
            className="button button--primary"
            onClick={handleCheck}
            disabled={isChecking || isCompleted}
          >
            {isChecking ? 'Проверяем…' : 'Проверить'}
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={handleReset}
            disabled={isChecking || isRunning || isCompleted}
          >
            Сбросить
          </button>

          {isCompleted ? <span className="badge badge--success">Выполнено</span> : null}
        </div>

        {runResult ? (
          <div
            className={`feedback ${runResult.ok ? 'feedback--success' : 'feedback--error'}`}
            role="status"
            aria-live="polite"
          >
            <p className="feedback__title">
              {runResult.ok ? 'Код выполнен успешно' : 'Код не выполнился'}
            </p>

            {runResult.error ? (
              <p className="feedback__error-message">
                {runResult.error}
                {runResult.line ? ` (строка ${runResult.line})` : ''}
              </p>
            ) : null}

            {runResult.output && runResult.output.length > 0 ? (
              <div className="feedback__console">
                <p className="feedback__console-title">Вывод console.log:</p>
                <pre>{runResult.output.join('\n')}</pre>
              </div>
            ) : (
              <p className="feedback__text">Вывода console.log нет.</p>
            )}

            {runResult.ok && typeof runResult.result !== 'undefined' && runResult.result !== undefined ? (
              <p className="feedback__text">
                Результат последнего выражения: <code>{String(runResult.result)}</code>
              </p>
            ) : null}
          </div>
        ) : null}

        <CodeFeedback result={result} isChecking={isChecking} hints={hints} />
      </div>
    </div>
  );
}

import { useCallback, useMemo, useState } from 'react';
import { analyzeCode, describeRuntimeError } from '../utils/codeAnalyzer';
import { checkTask, buildHints } from '../utils/codeChecker';
import { runCode } from '../utils/codeRunner';

/**
 * Хук для работы с кодом задания: анализ, запуск, проверка тестами.
 *
 * Разделяет два уровня обратной связи:
 *  - analyze() — быстрая проверка синтаксиса, срабатывает при наборе кода;
 *  - check()  — полный прогон с тестами, запускается по кнопке.
 *
 * @param {object} task Задание с тестами.
 * @param {string} initialCode Стартовый код.
 */
export default function useCodeCheck(task, initialCode = '') {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [syntaxError, setSyntaxError] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Живой анализ синтаксиса: подсвечиваем проблемную строку, пока ученик пишет.
  const analyze = useCallback((source) => {
    const analysis = analyzeCode(source);

    if (analysis.ok) {
      setSyntaxError(null);
      return true;
    }

    const first = analysis.errors[0];
    setSyntaxError(first);
    return false;
  }, []);

  const handleChange = useCallback(
    (nextCode) => {
      setCode(nextCode);
      analyze(nextCode);
    },
    [analyze],
  );

  const check = useCallback(async () => {
    setIsChecking(true);

    try {
      const checkResult = await checkTask(task, code);

      // Ошибки исполнения превращаем в тот же формат, что и синтаксические.
      if (checkResult.fatal && checkResult.errors.length > 0) {
        const first = checkResult.errors[0];
        setSyntaxError(first.line ? first : null);
      } else {
        setSyntaxError(null);
      }

      setResult(checkResult);
      return checkResult;
    } catch (error) {
      const described = describeRuntimeError({
        message: error && error.message ? error.message : String(error),
        errorType: error && error.name,
      });

      setResult({
        passed: false,
        tests: [],
        errors: [described],
        output: [],
        fatal: true,
      });
      setSyntaxError(null);

      return null;
    } finally {
      setIsChecking(false);
    }
  }, [code, task]);

  const run = useCallback(async () => {
    setIsRunning(true);
    setRunResult(null);

    try {
      const analysis = analyzeCode(code);

      if (!analysis.ok) {
        const first = analysis.errors[0] || {
          title: 'Ошибка в коде',
          message: 'Код не может быть выполнен',
          hint: 'Проверьте синтаксис.',
          line: null,
          column: null,
        };

        setSyntaxError(first.line ? first : null);

        const failed = {
          ok: false,
          output: [],
          error: first.message,
          errorType: 'SyntaxError',
          line: first.line,
          column: first.column,
          result: undefined,
        };

        setRunResult(failed);
        return failed;
      }

      setSyntaxError(null);

      const executed = await runCode(code);

      if (!executed.ok) {
        const described = describeRuntimeError(executed);
        setSyntaxError(described.line ? described : null);

        const failed = {
          ok: false,
          output: executed.output || [],
          error: described.message,
          errorType: executed.errorType || 'Error',
          line: described.line,
          column: described.column,
          result: undefined,
        };

        setRunResult(failed);
        return failed;
      }

      const success = {
        ok: true,
        output: executed.output || [],
        error: null,
        errorType: null,
        line: null,
        column: null,
        result: executed.result,
      };

      setRunResult(success);
      return success;
    } catch (error) {
      const described = describeRuntimeError({
        message: error && error.message ? error.message : String(error),
        errorType: error && error.name,
      });

      const failed = {
        ok: false,
        output: [],
        error: described.message,
        errorType: described.title,
        line: described.line,
        column: described.column,
        result: undefined,
      };

      setRunResult(failed);
      return failed;
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  const reset = useCallback(() => {
    setCode(initialCode);
    setResult(null);
    setRunResult(null);
    setSyntaxError(null);
  }, [initialCode]);

  const hints = useMemo(() => buildHints(task, result), [task, result]);

  // Строка с ошибкой для подсветки в редакторе.
  const errorLine = useMemo(() => {
    if (syntaxError && typeof syntaxError.line === 'number') return syntaxError.line;

    if (result && result.errors && result.errors.length > 0) {
      const first = result.errors[0];
      if (typeof first.line === 'number') return first.line;
    }

    return null;
  }, [syntaxError, result]);

  return {
    code,
    setCode: handleChange,
    result,
    isChecking,
    syntaxError,
    errorLine,
    hints,
    check,
    run,
    runResult,
    isRunning,
    reset,
  };
}

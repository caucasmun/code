/**
 * Автоматическая проверка практических заданий.
 *
 * Задание описывается тест-кейсами: ученик пишет функцию с заданным
 * именем, а мы вызываем её с тестовыми аргументами и сравниваем
 * результат с ожидаемым.
 *
 * Формат задания:
 * {
 *   id: 1,
 *   title: 'Сложи два числа',
 *   description: '...',
 *   criteria: '...',
 *   completionMode: 'auto',
 *   starterCode: 'function sum(a, b) {\n  // ...\n}',
 *   functionName: 'sum',
 *   tests: [
 *     { args: [2, 3], expected: 5, description: 'Складывает положительные числа' },
 *   ],
 *   hints: ['Подсказка 1', 'Подсказка 2'],
 * }
 */

import { runAndGetFunction } from './codeRunner';
import { analyzeCode, describeRuntimeError } from './codeAnalyzer';

/** Сравнивает два значения с учётом вложенных массивов и объектов. */
export function deepEqual(actual, expected) {
  if (Object.is(actual, expected)) return true;

  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) return false;
    return expected.every((item, index) => deepEqual(actual[index], item));
  }

  if (
    expected &&
    actual &&
    typeof expected === 'object' &&
    typeof actual === 'object' &&
    !Array.isArray(expected)
  ) {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    if (expectedKeys.length !== actualKeys.length) return false;
    return expectedKeys.every((key) => deepEqual(actual[key], expected[key]));
  }

  return false;
}

/** Приводит значение к короткому читаемому виду для показа в интерфейсе. */
export function formatResult(value) {
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'function') return '[функция]';

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}

/**
 * Проверяет код задания по его тест-кейсам.
 *
 * @param {object} task Задание с тестами.
 * @param {string} code Код ученика.
 * @returns {Promise<{passed: boolean, tests: Array, errors: Array, output: string[], fatal: boolean}>}
 */
export async function checkTask(task, code) {
  const source = typeof code === 'string' ? code : '';
  const emptyResult = { passed: false, tests: [], errors: [], output: [], fatal: false };

  if (source.trim() === '') {
    return {
      ...emptyResult,
      fatal: true,
      errors: [
        {
          line: null,
          column: null,
          title: 'Код пока пуст',
          hint: 'Напишите решение задания в редакторе кода и нажмите «Проверить».',
          message: 'Пустой код',
        },
      ],
    };
  }

  // Сначала ищем синтаксические ошибки — запускать код без смысла.
  const analysis = analyzeCode(source);
  if (!analysis.ok) {
    return { ...emptyResult, fatal: true, errors: analysis.errors };
  }

  const functionName = task.functionName;
  if (!functionName) {
    return { ...emptyResult, fatal: true, errors: [buildError('В задании не указана функция для проверки.')] };
  }

  const started = await runAndGetFunction(source, functionName);

  if (!started.ok) {
    const described = describeRuntimeError(started);
    return { ...emptyResult, fatal: true, errors: [described], output: started.output || [] };
  }

  const tests = Array.isArray(task.tests) ? task.tests : [];
  const results = [];

  for (let index = 0; index < tests.length; index += 1) {
    const test = tests[index];
    const args = Array.isArray(test.args) ? test.args : [];
    const expected = test.expected;

    let actual;
    let error = null;

    try {
      actual = started.fn(...args);
    } catch (thrown) {
      error = thrown;
    }

    if (error) {
      results.push({
        index,
        description: test.description || `Тест ${index + 1}`,
        args,
        expected,
        actual: undefined,
        ok: false,
        error: error.message || String(error),
        errorName: error.name || 'Error',
      });
      continue;
    }

    const ok = deepEqual(actual, expected);

    results.push({
      index,
      description: test.description || `Тест ${index + 1}`,
      args,
      expected,
      actual,
      ok,
      error: null,
      errorName: null,
    });
  }

  const failed = results.filter((result) => !result.ok);

  return {
    passed: failed.length === 0 && results.length > 0,
    tests: results,
    errors: [],
    output: started.output || [],
    fatal: false,
  };
}

/** Собирает одно сообщение об ошибке в едином формате. */
function buildError(message, hint) {
  return {
    line: null,
    column: null,
    title: 'Ошибка в задании',
    hint: hint || 'Проверьте решение и попробуйте снова.',
    message,
  };
}

/**
 * Формирует подсказки для задания: сначала общая, затем конкретные.
 *
 * @param {object} task Задание.
 * @param {object} [result] Результат последней проверки.
 * @returns {string[]}
 */
export function buildHints(task, result) {
  const hints = Array.isArray(task.hints) ? [...task.hints] : [];

  if (result && result.tests) {
    const failed = result.tests.find((test) => !test.ok);

    if (failed) {
      if (failed.error) {
        hints.unshift(
          `На тесте «${failed.description}» код упал с ошибкой: ${failed.error}. Обычно это неверный тип данных или отсутствие проверки ввода.`,
        );
      } else {
        hints.unshift(
          `На тесте «${failed.description}» ожидалось ${formatResult(failed.expected)}, а получено ${formatResult(failed.actual)}.`,
        );
      }
    }
  }

  return hints;
}

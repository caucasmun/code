/**
 * Безопасный запуск пользовательского кода.
 *
 * Код из поля ввода выполняется в «песочнице»:
 *  - доступ к window/document и другим глобальным объектам блокируется;
 *  - выполнение ограничено по времени (Promise.race + таймер);
 *  - перехватываются и синхронные, и асинхронные ошибки;
 *  - вывод console.log собирается и показывается ученику.
 *
 * Это не настоящая песочница уровня браузера, а достаточная защита
 * для учебных задач: ученик не должен сломать приложение одной строкой.
 */

const MAX_EXECUTION_MS = 1500;

/**
 * Глобальные имена, которые запрещено использовать в заданиях.
 * Они передаются в код как параметры-ловушки и бросают понятную ошибку.
 */
const FORBIDDEN_GLOBALS = [
  'window',
  'document',
  'globalThis',
  'self',
  'top',
  'parent',
  'frames',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'navigator',
  'location',
  'history',
  'XMLHttpRequest',
  'fetch',
  'WebSocket',
  'Worker',
  'importScripts',
  'postMessage',
  'Function',
  'alert',
  'prompt',
  'confirm',
  'print',
  'open',
];

/**
 * Создаёт ловушку вместо запрещённого глобального объекта.
 * Любое обращение к свойству выбросит понятную ошибку.
 */
function createTrap(name) {
  const target = function trapTarget() {};

  return new Proxy(target, {
    get(trapTarget, property) {
      // Служебные свойства функции не считаются «использованием».
      if (property === 'name' || property === 'length' || property === 'prototype') {
        return trapTarget[property];
      }

      throw new Error(`Использовать «${name}» в заданиях нельзя`);
    },
    set() {
      throw new Error(`Использовать «${name}» в заданиях нельзя`);
    },
    apply() {
      throw new Error(`Использовать «${name}» в заданиях нельзя`);
    },
    has() {
      return false;
    },
  });
}

/** Приводит значение к читаемому для ученика виду. */
function formatValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'function') return `[функция ${value.name || 'без имени'}]`;

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}
/**
 * Создаёт объект-песочницу с безопасными заглушками.
 * Всё, что пользовательский код может вызвать, не должно трогать страницу.
 */
function createSandbox(consoleOutput) {
  const write = (...args) => {
    consoleOutput.push(args.map(formatValue).join(' '));
  };

  return {
    console: {
      log: write,
      info: write,
      warn: write,
      error: write,
      debug: write,
      table: write,
    },
    Math,
    JSON,
    Date,
    Number,
    String,
    Boolean,
    Array,
    Object,
    RegExp,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Promise,
    Symbol,
    BigInt,
    Intl,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURIComponent,
    decodeURIComponent,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };
}

/**
 * Определяет смещение номеров строк между кодом ученика и стеком ошибок.
 *
 * В стеке V8 строка новой функции начинается не с 1, а с нескольких служебных
 * строк. Чтобы показывать ученику правильный номер строки, мы заранее
 * выбрасываем эталонную ошибку с той же конструкцией и сравниваем.
 */
function detectLineOffset() {
  try {
    // eslint-disable-next-line no-new-func
    const probe = new Function('throw new Error("probe")');
    probe();
  } catch (error) {
    const match = (error.stack || '').match(/<anonymous>:(\d+):(\d+)/);
    if (match) {
      // Эталонная ошибка находится на строке 1 нашего кода.
      return Math.max(0, Number(match[1]) - 1);
    }
  }

  return 0;
}

/**
 * Извлекает номер строки пользовательского кода из стека ошибки.
 *
 * @param {string} stack Текст стека.
 * @param {number} offset Смещение, найденное функцией detectLineOffset.
 * @returns {{line: number, column: number}|null}
 */
export function extractPosition(stack, offset = 0) {
  if (typeof stack !== 'string') return null;

  const match = stack.match(/<anonymous>:(\d+):(\d+)/);
  if (!match) return null;

  const line = Math.max(1, Number(match[1]) - offset);
  const column = Math.max(1, Number(match[2]));

  return { line, column };
}



/**
 * Выполняет код в песочнице и возвращает результат.
 *
 * @param {string} code Код для выполнения.
 * @param {object} [options]
 * @param {object} [options.scope] Переменные, доступные коду извне.
 * @param {number} [options.timeout] Ограничение по времени в миллисекундах.
 * @returns {Promise<{ok: boolean, result?: *, output: string[], error?: string, errorType?: string, line?: number, column?: number}>}
 */
export async function runCode(code, options = {}) {
  const { scope = {}, timeout = MAX_EXECUTION_MS } = options;
  const output = [];

  const sandbox = createSandbox(output);
  const offset = detectLineOffset();

  let timerId = null;
  const timeoutPromise = new Promise((resolve) => {
    timerId = setTimeout(() => {
      resolve({
        ok: false,
        output,
        error: `Выполнение прервано: код работал дольше ${timeout} мс. Возможно, получился бесконечный цикл.`,
        errorType: 'timeout',
      });
    }, timeout);
  });

  try {
    // Запрещённые глобалы передаются параметрами-ловушками:
    // так они затеняют настоящие window/document внутри функции.
    const trapNames = FORBIDDEN_GLOBALS;
    const trapValues = trapNames.map((name) => createTrap(name));

    // eslint-disable-next-line no-new-func
    const runner = new Function(
      ...trapNames,
      ...Object.keys(sandbox),
      ...Object.keys(scope),
      `"use strict";\n${code}`,
    );

    const execution = Promise.resolve().then(() =>
      runner(...trapValues, ...Object.values(sandbox), ...Object.values(scope)),
    );

    const result = await Promise.race([execution, timeoutPromise]);

    return { ok: true, output, result };
  } catch (error) {
    const position = extractPosition(error && error.stack, offset);

    return {
      ok: false,
      output,
      error: error && error.message ? error.message : String(error),
      errorType: error && error.name ? error.name : 'Error',
      line: position ? position.line : null,
      column: position ? position.column : null,
    };
  } finally {
    if (timerId) clearTimeout(timerId);
  }
}

/**
 * Выполняет код и возвращает объявленную им функцию по имени.
 *
 * Ученик пишет `function sum(a, b) {...}`, а проверка вызывает её
 * с тестовыми аргументами. Если функция не объявлена — вернётся null.
 *
 * @param {string} code Код ученика.
 * @param {string} functionName Имя искомой функции.
 * @param {object} [options] Настройки прогона.
 * @returns {Promise<{ok: boolean, fn: Function|null, output: string[], error?: string, line?: number}>}
 */
export async function runAndGetFunction(code, functionName, options = {}) {
  // typeof для необъявленного имени не бросает ошибку, поэтому код безопасен.
  const wrapper = `${code}\n;return (typeof ${functionName} === 'undefined') ? null : ${functionName};`;

  const result = await runCode(wrapper, options);

  if (!result.ok) {
    return { ...result, fn: null };
  }

  if (typeof result.result !== 'function') {
    return {
      ok: false,
      fn: null,
      output: result.output,
      error: `В коде нет функции с именем «${functionName}». Проверьте, что она объявлена и называется именно так.`,
      errorType: 'missing-function',
    };
  }

  return { ok: true, fn: result.result, output: result.output };
}

export { FORBIDDEN_GLOBALS, MAX_EXECUTION_MS, formatValue };

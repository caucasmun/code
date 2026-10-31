import { parse } from '@babel/parser';

/**
 * Разбор пользовательского кода и поиск ошибок.
 *
 * Задача модуля — не «запустить и посмотреть, упало ли», а объяснить:
 *  - где именно ошибка (номер строки и столбца);
 *  - что означает эта ошибка простыми словами;
 *  - что можно сделать, чтобы её исправить.
 */

/**
 * Глобальные объекты, к которым ученик не должен обращаться.
 * В песочнице они также подменяются ловушками (см. codeRunner.js),
 * но статическая проверка позволяет объяснить проблему заранее.
 */
const FORBIDDEN_GLOBALS = [
  'window',
  'document',
  'globalThis',
  'self',
  'localStorage',
  'sessionStorage',
  'navigator',
  'location',
  'fetch',
  'XMLHttpRequest',
  'eval',
  'Function',
];

/** Понятные объяснения для стандартных ошибок JavaScript. */
const ERROR_EXPLANATIONS = {
  'SyntaxError: Unexpected end of input': {
    title: 'Код не дописан',
    hint: 'Скобка или кавычка не закрыта. Проверьте, чтобы у каждой открытой скобки была пара.',
  },
  'Uncaught SyntaxError': {
    title: 'Ошибка в синтаксисе',
    hint: 'Проверьте точки, запятые, скобки и названия переменных.',
  },
  'ReferenceError': {
    title: 'Переменная не объявлена',
    hint: 'Такой переменной нет. Возможно, вы забыли объявить её через let или const — либо написали имя с опечаткой.',
  },
  'TypeError': {
    title: 'Неправильный тип данных',
    hint: 'Операция не подходит для этого значения. Например, к строке прибавили число или у числа вызвали метод массива.',
  },
  'RangeError': {
    title: 'Значение выходит за допустимые границы',
    hint: 'Например, длина массива отрицательная или рекурсия слишком глубокая.',
  },
  'SyntaxError': {
    title: 'Ошибка в синтаксисе',
    hint: 'Код не может быть разобран. Проверьте скобки, запятые и кавычки.',
  },
  'Infinity': {
    title: 'Бесконечность',
    hint: 'Значение ушло за пределы числа. Проверьте деление и умножение.',
  },
};

/**
 * Убирает служебные префиксы V8 из текста ошибки,
 * чтобы в интерфейсе осталось понятное сообщение.
 */
function cleanErrorMessage(message) {
  if (typeof message !== 'string') return 'Неизвестная ошибка';

  return message
    .replace(/^Uncaught\s+/i, '')
    .replace(/\s*\(?eval.*$/i, '')
    .trim();
}

/**
 * Определяет заголовок и подсказку для сообщения об ошибке.
 */
export function explainError(message, errorName) {
  const cleaned = cleanErrorMessage(message);
  const byName = ERROR_EXPLANATIONS[errorName];

  if (byName) {
    return { title: byName.title, hint: byName.hint, message: cleaned };
  }

  if (cleaned.includes('Unexpected end of input')) {
    return {
      title: 'Код не дописан',
      hint: 'Скобка или кавычка не закрыта. Проверьте, чтобы у каждой открытой скобки была пара.',
      message: cleaned,
    };
  }

  if (cleaned.includes('is not defined')) {
    return {
      title: 'Переменная не объявлена',
      hint: 'Такой переменной нет. Возможно, вы забыли объявить её через let или const — либо написали имя с опечаткой.',
      message: cleaned,
    };
  }

  return {
    title: 'Ошибка в коде',
    hint: 'Посмотрите на строку с ошибкой и проверьте значения и названия переменных.',
    message: cleaned,
  };
}

/**
 * Разбирает код парсером Babel и возвращает список синтаксических ошибок.
 *
 * @param {string} code Исходный код.
 * @returns {Array<{line: number, column: number, title: string, hint: string, message: string}>}
 */
export function findSyntaxErrors(code) {
  if (typeof code !== 'string' || code.trim() === '') {
    return [];
  }

  try {
    parse(code, {
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      errorRecovery: false,
      plugins: ['optionalChaining', 'nullishCoalescingOperator'],
    });

    return [];
  } catch (error) {
    const location = error.loc || { line: 1, column: 0 };
    const explained = explainError(error.message, error.name);

    return [
      {
        line: location.line,
        column: location.column,
        title: explained.title,
        hint: explained.hint,
        message: explained.message,
      },
    ];
  }
}

/**
 * Извлекает из строки ошибки номер строки, если он есть.
 * Babel сообщает позицию в свойстве loc, но рантайм-ошибки
 * приходят уже без него — тогда номер строки ищется в тексте.
 */
export function extractLineNumber(message) {
  if (typeof message !== 'string') return null;

  const match = message.match(/line (\d+)/i);
  if (match) return Number(match[1]);

  return null;
}

/**
 * Ищет обращения к запрещённым глобальным объектам.
 *
 * Строковые литералы и комментарии отбрасываются, чтобы
 * «window.alert» в строке не считалось нарушением.
 *
 * @param {string} code Исходный код.
 * @returns {Array<{name: string, line: number, column: number}>}
 */
export function findForbiddenUsages(code) {
  if (typeof code !== 'string' || code.trim() === '') return [];

  const usages = [];

  // Убираем комментарии и содержимое строк, чтобы не ловить ложные срабатывания.
  const cleaned = code
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/'(?:\\.|[^'\\\n])*'/g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/"(?:\\.|[^"\\\n])*"/g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/`(?:\\.|[^`\\])*`/g, (match) => match.replace(/[^\n]/g, ' '));

  const lines = cleaned.split('\n');

  lines.forEach((lineText, index) => {
    FORBIDDEN_GLOBALS.forEach((name) => {
      // Ищем обращение как отдельное слово: window, window.x, window['x'].
      const pattern = new RegExp(`(^|[^\\w$.])${name}\\s*(\\.|\\[|\\()`, 'm');
      const match = pattern.exec(lineText);

      if (match) {
        const column = lineText.indexOf(name, match.index > 0 ? match.index : 0) + 1;
        usages.push({ name, line: index + 1, column });
      }
    });
  });

  return usages;
}

/**
 * Приводит runtime-ошибку к тому же виду, что и синтаксическую.
 *
 * @param {{message?: string, errorType?: string, line?: number, column?: number}} error
 * @returns {{line: number|null, column: number|null, title: string, hint: string, message: string}}
 */
export function describeRuntimeError(error) {
  const rawMessage = (error && error.message) || 'Неизвестная ошибка';
  const errorName = error && error.errorType ? error.errorType : 'Error';
  const explained = explainError(rawMessage, errorName);

  return {
    line: error && typeof error.line === 'number' ? error.line : null,
    column: error && typeof error.column === 'number' ? error.column : null,
    title: explained.title,
    hint: explained.hint,
    message: explained.message,
  };
}

/**
 * Проверяет код без запуска: синтаксис и запрещённые конструкции.
 *
 * @param {string} code Исходный код.
 * @returns {{ok: boolean, errors: Array}}
 */
export function analyzeCode(code) {
  const errors = findSyntaxErrors(code);

  if (errors.length === 0) {
    findForbiddenUsages(code).forEach((usage) => {
      errors.push({
        line: usage.line,
        column: usage.column,
        title: `Использовать «${usage.name}» нельзя`,
        hint: `В заданиях нет доступа к браузеру. Уберите «${usage.name}» — код должен работать только с обычными данными.`,
        message: `Запрещённый объект «${usage.name}»`,
      });
    });
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export { ERROR_EXPLANATIONS, cleanErrorMessage, FORBIDDEN_GLOBALS };


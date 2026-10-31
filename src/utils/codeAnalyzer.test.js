import { describe, it, expect } from 'vitest';
import {
  analyzeCode,
  cleanErrorMessage,
  describeRuntimeError,
  explainError,
  extractLineNumber,
  findForbiddenUsages,
  findSyntaxErrors,
} from './codeAnalyzer';

describe('findSyntaxErrors', () => {
  it('не находит ошибок в корректном коде', () => {
    expect(findSyntaxErrors('const sum = (a, b) => a + b;')).toEqual([]);
  });

  it('находит незакрытую скобку и возвращает позицию', () => {
    const errors = findSyntaxErrors('function sum(a, b) {\n  return a + b;\n');

    expect(errors).toHaveLength(1);
    expect(errors[0].line).toBe(3);
    expect(errors[0].hint).toBeTruthy();
  });

  it('пустой код не считается синтаксической ошибкой', () => {
    expect(findSyntaxErrors('')).toEqual([]);
    expect(findSyntaxErrors('   ')).toEqual([]);
    expect(findSyntaxErrors(null)).toEqual([]);
  });
});

describe('findForbiddenUsages', () => {
  it('находит обращение к window с номером строки', () => {
    const usages = findForbiddenUsages('const a = 1;\nwindow.alert(a);');

    expect(usages).toHaveLength(1);
    expect(usages[0].name).toBe('window');
    expect(usages[0].line).toBe(2);
  });

  it('находит обращение через квадратные скобки', () => {
    const usages = findForbiddenUsages("document['title'];");

    expect(usages.map((usage) => usage.name)).toContain('document');
  });

  it('не считает словом в строке обращением к глобалу', () => {
    expect(findForbiddenUsages('const text = "window.location.href";')).toEqual([]);
  });

  it('не считает словом в комментарии обращением к глобалу', () => {
    expect(findForbiddenUsages('// window.alert(1)\n/* document.body */')).toEqual([]);
  });

  it('не считает словом в имени переменной обращением к глобалу', () => {
    expect(findForbiddenUsages('const myWindow = 1;')).toEqual([]);
  });

  it('пустой код не даёт срабатываний', () => {
    expect(findForbiddenUsages('')).toEqual([]);
  });
});

describe('cleanErrorMessage', () => {
  it('убирает префикс Uncaught и ссылку на eval', () => {
    expect(cleanErrorMessage('Uncaught ReferenceError: x is not defined (eval at foo)')).toBe(
      'ReferenceError: x is not defined',
    );
  });

  it('на нестроке возвращает понятный текст', () => {
    expect(cleanErrorMessage(undefined)).toBe('Неизвестная ошибка');
  });
});

describe('explainError', () => {
  it('объясняет ReferenceError', () => {
    const result = explainError('x is not defined', 'ReferenceError');

    expect(result.title).toBe('Переменная не объявлена');
    expect(result.message).toBe('x is not defined');
  });

  it('находит незакрытый ввод по тексту сообщения', () => {
    const result = explainError('Unexpected end of input', 'Error');

    expect(result.title).toBe('Код не дописан');
  });

  it('для неизвестной ошибки даёт общий совет', () => {
    const result = explainError('Что-то пошло не так', 'Error');

    expect(result.title).toBe('Ошибка в коде');
    expect(result.hint).toBeTruthy();
  });
});

describe('extractLineNumber', () => {
  it('находит номер строки в тексте ошибки', () => {
    expect(extractLineNumber('SyntaxError: Unexpected end of input (line 12)')).toBe(12);
  });

  it('возвращает null, если номера строки нет', () => {
    expect(extractLineNumber('ReferenceError: x is not defined')).toBeNull();
    expect(extractLineNumber(null)).toBeNull();
  });
});

describe('describeRuntimeError', () => {
  it('приводит ошибку к единому виду', () => {
    const result = describeRuntimeError({
      message: 'x is not defined',
      errorType: 'ReferenceError',
      line: 4,
      column: 7,
    });

    expect(result).toMatchObject({ line: 4, column: 7, title: 'Переменная не объявлена' });
  });

  it('подставляет значения по умолчанию', () => {
    const result = describeRuntimeError({});

    expect(result.line).toBeNull();
    expect(result.column).toBeNull();
    expect(result.message).toBe('Неизвестная ошибка');
  });
});

describe('analyzeCode', () => {
  it('корректный код проходит проверку', () => {
    const result = analyzeCode('const sum = (a, b) => a + b;');

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('при синтаксической ошибке не ищет глобалы', () => {
    const result = analyzeCode('window.alert(');

    expect(result.ok).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].title).toBe('Ошибка в синтаксисе');
    expect(result.errors[0].line).toBe(1);
  });

  it('запрещённый глобал даёт понятное объяснение', () => {
    const result = analyzeCode('window.alert(1);');

    expect(result.ok).toBe(false);
    expect(result.errors[0].title).toContain('window');
    expect(result.errors[0].hint).toBeTruthy();
  });
});

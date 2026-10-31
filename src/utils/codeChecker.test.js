import { describe, it, expect } from 'vitest';
import { buildHints, deepEqual, formatResult } from './codeChecker';

describe('deepEqual', () => {
  it('сравнивает примитивы', () => {
    expect(deepEqual(5, 5)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
  });

  it('сравнивает массивы', () => {
    expect(deepEqual([1, 2], [1, 2])).toBe(true);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
    expect(deepEqual([1], [1, 2])).toBe(false);
  });

  it('сравнивает объекты', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });
});

describe('formatResult', () => {
  it('показывает строки в кавычках', () => {
    expect(formatResult('текст')).toBe('"текст"');
  });

  it('показывает undefined и функции', () => {
    expect(formatResult(undefined)).toBe('undefined');
    expect(formatResult(() => {})).toBe('[функция]');
  });

  it('показывает объекты в JSON', () => {
    expect(formatResult({ a: 1 })).toBe('{"a":1}');
  });
});

describe('buildHints', () => {
  const task = { hints: ['Общая подсказка'] };

  it('возвращает подсказки задания, если ошибок нет', () => {
    expect(buildHints(task, { tests: [{ ok: true }] })).toEqual(['Общая подсказка']);
  });

  it('добавляет подсказку про ожидаемое значение', () => {
    const hints = buildHints(task, {
      tests: [{ ok: false, expected: 5, actual: 3, error: null, description: 'Тест 1' }],
    });

    expect(hints).toHaveLength(2);
    expect(hints[0]).toContain('3');
  });

  it('добавляет подсказку про ошибку выполнения', () => {
    const hints = buildHints(task, {
      tests: [{ ok: false, error: 'TypeError', description: 'Тест 1' }],
    });

    expect(hints[0]).toContain('TypeError');
  });
});

import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  analyzeProject,
  compareClasses,
  extractDefinedClasses,
  extractUsedClasses,
  isTestFile,
  stripCssNoise,
  IGNORED_CLASSES,
} from '../../check-classes.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

describe('extractUsedClasses', () => {
  it('собирает классы из статического className', () => {
    const { used } = extractUsedClasses('<div className="game game__panel"></div>');

    expect(used).toEqual(expect.arrayContaining(['game', 'game__panel']));
  });

  it('собирает классы из className с фигурными скобками', () => {
    const { used } = extractUsedClasses("<span className={'badge badge--easy'}>easy</span>");

    expect(used).toEqual(expect.arrayContaining(['badge', 'badge--easy']));
  });

  it('распознаёт динамический префикс в шаблонной строке', () => {
    const { used, prefixes } = extractUsedClasses(
      '<span className={`badge badge--${difficulty}`}></span>',
    );

    expect(used).toContain('badge');
    expect(prefixes).toContain('badge--');
    expect(used).not.toContain('badge--');
  });

  it('убирает одинаковые классы', () => {
    const { used } = extractUsedClasses('<i className="a" /><i className="a" />');

    expect(used).toEqual(['a']);
  });

  it('классы в тернарных ветках считаются реальными', () => {
    const { used } = extractUsedClasses(
      '<p className={`alert ${ok ? "alert--success" : "alert--error"}`}></p>',
    );

    expect(used).toEqual(expect.arrayContaining(['alert', 'alert--success', 'alert--error']));
  });

  it('строки сравнения не считаются классами', () => {
    const { used } = extractUsedClasses(
      '<div className={`rps__result rps__result--${result}`}></div>',
    );

    expect(used).toEqual(expect.arrayContaining(['rps__result']));
    expect(used).not.toContain('result');
  });

  it('пустая разметка не даёт классов', () => {
    expect(extractUsedClasses('')).toEqual({ used: [], prefixes: [] });
  });
});

describe('extractDefinedClasses', () => {
  it('находит классы, модификаторы и элементы', () => {
    const names = extractDefinedClasses('.a {}\n.b--mod {}\n.c__part {}');

    expect(names).toEqual(expect.arrayContaining(['a', 'b--mod', 'c__part']));
  });
});

describe('stripCssNoise', () => {
  it('убирает @import, url() и комментарии', () => {
    const css = '@import "./a.css";\n/* .commented */\n.a { background: url("./img.png"); }';

    expect(stripCssNoise(css)).not.toContain('.commented');
    expect(stripCssNoise(css)).not.toContain('.css');
    expect(stripCssNoise(css)).not.toContain('img.png');
  });
});

describe('compareClasses', () => {
  it('находит класс без стилей', () => {
    const result = compareClasses(['used'], ['other']);

    expect(result.missing).toEqual(['used']);
  });

  it('находит неиспользуемый класс в CSS', () => {
    const result = compareClasses(['used'], ['used', 'orphan']);

    expect(result.unused).toEqual(['orphan']);
  });

  it('игнорирует служебные классы', () => {
    const result = compareClasses(['active'], []);

    expect(result.missing).toEqual([]);
    expect(IGNORED_CLASSES.has('active')).toBe(true);
  });

  it('динамический префикс считается покрытым, если есть хоть один модификатор', () => {
    const result = compareClasses(['badge'], ['badge', 'badge--easy'], ['badge--']);

    expect(result.missingPrefixes).toEqual([]);
    expect(result.unused).toEqual([]);
  });

  it('сообщает о динамическом префиксе без стилей', () => {
    const result = compareClasses(['badge'], ['badge'], ['badge--']);

    expect(result.missingPrefixes).toEqual(['badge--']);
  });
});

describe('isTestFile', () => {
  it('узнаёт файлы тестов', () => {
    expect(isTestFile('codeAnalyzer.test.js')).toBe(true);
    expect(isTestFile('game.spec.jsx')).toBe(true);
    expect(isTestFile('RockPaperScissorsGame.jsx')).toBe(false);
  });
});

describe('analyzeProject', () => {
  it('не считает классы из тестовых файлов разметкой приложения', () => {
    const result = analyzeProject(path.join(projectRoot, 'src'));

    expect(result.missing).toEqual([]);
    expect(result.missingPrefixes).toEqual([]);
    expect(result.unused).toEqual([]);
  });
});

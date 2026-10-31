import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** Служебные классы и классы сторонних библиотек — их нет в наших CSS. */
export const IGNORED_CLASSES = new Set([
  'active',
  'visually-hidden',
  'code-block',
  'prose',
  'hljs',
  'notranslate',
]);

/** Собирает все файлы проекта по расширению. */
export function collectFiles(dir, matcher, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, matcher, out);
    else if (matcher(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Тестовые файлы не являются разметкой приложения:
 * внутри них «className=…» встречается как строковый литерал.
 * Поэтому они не участвуют в сверке классов.
 */
export function isTestFile(name) {
  return /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(name);
}

/**
 * Убирает из CSS всё, что не является классом:
 * комментарии, @import и url().
 */
export function stripCssNoise(text) {
  return text
    .replace(/@import[^;]+;/g, ' ')
    .replace(/url\([^)]*\)/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/**
 * Извлекает из CSS-файла имена описанных классов.
 */
export function extractDefinedClasses(text) {
  const names = [];
  // .имя, .имя--модификатор, .имя__элемент
  const re = /\.(-?[_a-zA-Z][\w-]*)/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/**
 * Извлекает классы, использованные в разметке.
 *
 * @param {string} text Содержимое JSX-файла.
 * @returns {{used: string[], prefixes: string[]}}
 */
export function extractUsedClasses(text) {
  const used = new Set();
  const prefixes = new Set();

  const add = (name) => {
    if (name) used.add(name);
  };

  const addPrefix = (name) => {
    if (name) prefixes.add(name);
  };

  // className="a b" — статический список.
  const literal = /className\s*=\s*"([^"]*)"/g;
  let match;
  while ((match = literal.exec(text)) !== null) {
    for (const name of match[1].split(/\s+/).filter(Boolean)) add(name);
  }

  // className={`...`} — шаблонная строка.
  const expression = /className\s*=\s*\{`([^`]*)`/g;
  while ((match = expression.exec(text)) !== null) {
    const template = match[1];
    const parts = template.split(/\$\{([^}]*)\}/);

    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        // Статический кусок. Если класс заканчивается на «-» и сразу
        // идёт подстановка (`badge--${difficulty}`) — это динамический
        // префикс, конкретное значение нам неизвестно.
        const chunks = part.split(/\s+/).filter(Boolean);
        const isLast = index === parts.length - 1;
        chunks.forEach((chunk) => {
          if (chunk.endsWith('-') && !isLast) {
            addPrefix(chunk);
            return;
          }
          add(chunk);
        });
        return;
      }

      // Подстановка ${...}. Классы берём только из тернарных веток
      // (`cond ? 'a b' : 'c'`) и `cond && 'a'` — это реальные классы.
      // Строки-операторы сравнения ('won', 'lost') сюда не попадают.
      const branch = /(?:\?|:|&&)\s*'([^']*)'|(?:\?|:|&&)\s*"([^"]*)"/g;
      let branchMatch;
      while ((branchMatch = branch.exec(part)) !== null) {
        const value = branchMatch[1] || branchMatch[2];
        if (!value) continue;
        for (const name of value.split(/\s+/).filter(Boolean)) add(name);
      }
    });
  }

  // className={'a b'} и className={"a b"}
  const plain = /className\s*=\s*\{\s*['"]([^'"]*)['"]\s*\}/g;
  while ((match = plain.exec(text)) !== null) {
    for (const name of match[1].split(/\s+/).filter(Boolean)) add(name);
  }

  return { used: [...used], prefixes: [...prefixes] };
}

/**
 * Сравнивает использованные и описанные классы.
 *
 * @param {string[]} usedClasses Классы из разметки.
 * @param {string[]} definedClasses Классы из CSS.
 * @param {string[]} dynamicPrefixes Динамические префиксы (`badge--`).
 * @returns {{missing: string[], missingPrefixes: string[], unused: string[]}}
 */
export function compareClasses(usedClasses, definedClasses, dynamicPrefixes = []) {
  const defined = new Set(definedClasses);
  const used = new Set(usedClasses);
  const prefixes = dynamicPrefixes.filter(Boolean);

  const missing = [];
  for (const name of used) {
    if (defined.has(name)) continue;
    if (IGNORED_CLASSES.has(name)) continue;
    missing.push(name);
  }

  // Динамические префиксы (`badge--${difficulty}`): нужен хотя бы один
  // класс в CSS, начинающийся с этого префикса.
  const missingPrefixes = [];
  for (const prefix of prefixes) {
    const hasMatch = [...defined].some((name) => name.startsWith(prefix));
    if (hasMatch) continue;
    missingPrefixes.push(prefix);
  }

  const unused = [];
  for (const name of defined) {
    if (used.has(name)) continue;
    if (IGNORED_CLASSES.has(name)) continue;
    // Класс покрыт динамическим префиксом — считаем используемым.
    if (prefixes.some((prefix) => name.startsWith(prefix))) continue;
    unused.push(name);
  }

  return { missing, missingPrefixes, unused };
}

/**
 * Собирает данные по проекту и сравнивает классы.
 *
 * @param {string} root Папка с исходниками.
 * @returns {{missing: Array, missingPrefixes: Array, unused: Array}}
 */
export function analyzeProject(root) {
  const jsxFiles = collectFiles(
    root,
    (n) => /\.(jsx?|tsx?)$/.test(n) && !isTestFile(n),
  );
  const cssFiles = collectFiles(root, (n) => n.endsWith('.css'));

  const used = new Map(); // класс -> Set(файлов)
  const prefixes = new Map(); // префикс динамического класса (badge--) -> Set(файлов)

  for (const file of jsxFiles) {
    const text = fs.readFileSync(file, 'utf8');
    const result = extractUsedClasses(text);

    for (const name of result.used) {
      if (!used.has(name)) used.set(name, new Set());
      used.get(name).add(file);
    }

    for (const name of result.prefixes) {
      if (!prefixes.has(name)) prefixes.set(name, new Set());
      prefixes.get(name).add(file);
    }
  }

  const defined = new Map(); // класс -> Set(файлов)

  for (const file of cssFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const text = stripCssNoise(raw);

    for (const name of extractDefinedClasses(text)) {
      if (!defined.has(name)) defined.set(name, new Set());
      defined.get(name).add(file);
    }
  }

  const comparison = compareClasses([...used.keys()], [...defined.keys()], [...prefixes.keys()]);

  return {
    missing: comparison.missing.map((name) => ({ name, files: [...used.get(name)] })),
    missingPrefixes: comparison.missingPrefixes.map((prefix) => ({
      prefix,
      files: [...prefixes.get(prefix)],
    })),
    unused: comparison.unused.map((name) => ({ name, files: [...defined.get(name)] })),
  };
}

/**
 * Печатает результат проверки.
 *
 * @param {{missing: Array, missingPrefixes: Array, unused: Array}} result
 * @returns {number} Код выхода: 0 — расхождений нет, 1 — есть.
 */
export function report(result) {
  const { missing, missingPrefixes, unused } = result;

  if (missing.length) {
    console.log('=== Классы в разметке без стилей ===');
    for (const item of missing) {
      console.log(`  .${item.name}  →  ${item.files.join(', ')}`);
    }
  }

  if (missingPrefixes.length) {
    console.log('\n=== Динамические классы без стилей ===');
    for (const item of missingPrefixes) {
      console.log(`  .${item.prefix}*  →  ${item.files.join(', ')}`);
    }
  }

  if (unused.length) {
    console.log('\n=== Классы в CSS без разметки ===');
    for (const item of unused) {
      console.log(`  .${item.name}  →  ${item.files.join(', ')}`);
    }
  }

  if (!missing.length && !unused.length && !missingPrefixes.length) {
    console.log('Все классы совпадают.');
  }

  return missing.length || missingPrefixes.length ? 1 : 0;
}

/* Запуск как скрипта: node check-classes.mjs src */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const root = process.argv[2] || 'src';
  process.exit(report(analyzeProject(root)));
}

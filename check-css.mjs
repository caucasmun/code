import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || 'src';
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) files.push(full);
  }
}
walk(root);

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const seen = new Map();
  const problems = [];

  lines.forEach((line, i) => {
    const m = line.match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);
    if (m) {
      if (seen.has(m[1])) {
        problems.push(`  дубль функции ${m[1]}: строки ${seen.get(m[1])} и ${i + 1}`);
      } else {
        seen.set(m[1], i + 1);
      }
    }
    const c = line.match(/^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/);
    if (c) {
      if (seen.has(c[1])) {
        problems.push(`  дубль константы ${c[1]}: строки ${seen.get(c[1])} и ${i + 1}`);
      } else {
        seen.set(c[1], i + 1);
      }
    }
    const cls = line.match(/^\s*(?:export\s+)?class\s+([A-Za-z_$][\w$]*)/);
    if (cls) {
      if (seen.has(cls[1])) {
        problems.push(`  дубль класса ${cls[1]}: строки ${seen.get(cls[1])} и ${i + 1}`);
      } else {
        seen.set(cls[1], i + 1);
      }
    }
  });

  // Ищем экспорт внутри тела функции (признак вставки в неверное место).
  let depth = 0;
  lines.forEach((line, i) => {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (depth > 0 && /^\s*export\s+(?:const|function|default|async)/.test(line)) {
      problems.push(`  export внутри блока (глубина ${depth}): строка ${i + 1}: ${line.trim()}`);
    }
    depth += opens - closes;
  });

  if (problems.length) {
    console.log(`\n${file}`);
    problems.forEach((p) => console.log(p));
  }
}
console.log('\nГотово.');

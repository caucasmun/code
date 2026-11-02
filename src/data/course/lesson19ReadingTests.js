export const lesson19ReadingTests = {
  id: 'reading-tests',
  slug: 'reading-tests',
  number: 19,
  title: 'Как читать тесты',
  subtitle: 'Expected vs Actual',
  icon: '🧪',
  duration: 5,
  topics: ['тесты', 'expected', 'actual'],
  intro: 'Тесты показывают, что ожидалось и что получилось.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться понимать вывод тестов.' },
    { title: '🌍 Пример из жизни', text: 'Учитель пишет: «ожидалось 5, а у тебя 3». Тест делает то же самое.' },
    { title: '💡 Объяснение', text: 'Expected — то, что должно быть. Actual — то, что получилось. Если они не совпадают — ищи ошибку.', code: '// expected: 5\n// actual:   3' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Исправь ошибку', description: 'Напиши код, который выводит 10.', criteria: 'Выводится 10.', starterCode: 'console.log(5 + 3);\n', expectedOutput: ['10'], hints: ['Проверь математику.'] }
  ]
};
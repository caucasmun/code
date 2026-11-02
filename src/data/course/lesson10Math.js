export const lesson10Math = {
  id: 'math-operators',
  slug: 'math-operators',
  number: 10,
  title: 'Математика в коде',
  subtitle: 'Считаем на JavaScript',
  icon: '🧮',
  duration: 5,
  topics: ['+', '-', '*', '/', '%'],
  intro: 'С числами можно делать всё то же, что и на калькуляторе.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться считать в JavaScript.' },
    { title: '🌍 Пример из жизни', text: 'Калькулятор в телефоне делает то же самое, только кнопками.' },
    { title: '💡 Объяснение', text: '+ (сложение), - (вычитание), * (умножение), / (деление). Знак % — это остаток от деления (например, 10 % 3 = 1).', code: 'console.log(10 + 3); // 13\nconsole.log(10 % 3); // 1 (остаток)' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Сумма', description: 'Выведи сумму чисел 15 и 27.', criteria: 'Выводится 42.', starterCode: '// Твой код\n', expectedOutput: ['42'], hints: ['console.log(15 + 27);'] },
    { id: 'p2', type: 'code', title: 'Остаток', description: 'Выведи остаток от деления 100 на 7.', criteria: 'Выводится 2.', starterCode: '// Твой код\n', expectedOutput: ['2'], hints: ['Используй оператор %: console.log(100 % 7);'] }
  ]
};
export const lesson12IfElse = {
  id: 'if-else',
  slug: 'if-else',
  number: 12,
  title: 'Условия (if/else)',
  subtitle: 'Принятие решений',
  icon: '🔀',
  duration: 5,
  topics: ['if', 'else', 'сравнения'],
  intro: 'Условия позволяют программе выбирать путь в зависимости от данных.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться принимать решения через if/else.' },
    { title: '🌍 Пример из жизни', text: 'Если на улице дождь — беру зонт, иначе — очки.' },
    { title: '💡 Объяснение', text: 'if (условие) { ... } else { ... }. Сравнения: >, <, === (строгое равно).', code: 'let rain = true;\nif (rain) {\n  console.log("Беру зонт");\n} else {\n  console.log("Беру очки");\n}' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Взрослый?', description: 'Создай let age = 20. Если age >= 18, выведи "Взрослый", иначе "Ребёнок".', criteria: 'Выводится "Взрослый".', starterCode: 'let age = 20;\n// Твой код\n', expectedOutput: ['Взрослый'], hints: ['Используй if (age >= 18) { console.log("Взрослый"); }'] }
  ]
};
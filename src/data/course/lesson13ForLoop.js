export const lesson13ForLoop = {
  id: 'for-loop',
  slug: 'for-loop',
  number: 13,
  title: 'Циклы (for)',
  subtitle: 'Повторение действий',
  icon: '🔁',
  duration: 5,
  topics: ['for', 'i++', 'циклы'],
  intro: 'Цикл for позволяет повторить действие N раз.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться повторять действия через for.' },
    { title: '🌍 Пример из жизни', text: 'Отжимания: «раз, два, три… десять».' },
    { title: '💡 Объяснение', text: 'for (let i = 0; i < 5; i++) { ... }. i++ — шаг цикла.', code: 'for (let i = 1; i <= 5; i++) {\n  console.log("Отжимание", i);\n}' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Числа от 1 до 5', description: 'Выведи числа от 1 до 5.', criteria: 'Выводятся числа 1, 2, 3, 4, 5.', starterCode: '// Твой код\n', expectedOutput: ['1', '2', '3', '4', '5'], hints: ['Используй for (let i = 1; i <= 5; i++) { console.log(i); }'] }
  ]
};
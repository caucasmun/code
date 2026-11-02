export const lesson9WhatIsVariable = {
  id: 'what-is-variable',
  slug: 'what-is-variable',
  number: 9,
  title: 'Переменные',
  subtitle: 'Коробки для данных',
  icon: '📦',
  duration: 5,
  topics: ['let', 'const', 'значения'],
  intro: 'Переменная — это коробка с наклейкой. Внутри лежит значение, которое можно достать.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться хранить данные в переменных.' },
    { title: '🌍 Пример из жизни', text: 'У тебя есть коробка с надписью «сахар». Ты кладёшь туда сахар. Потом можешь достать. Так и переменная: имя и значение.' },
    { title: '💡 Объяснение', text: 'let — коробку можно открыть и заменить содержимое. const — коробка с замком, поменять нельзя. Внутри может лежать число или текст.', code: 'let score = 0;\nscore = score + 10; // теперь 10\nconst name = "Аня";' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Создай переменную', description: 'Создай переменную age = 20 и выведи её.', criteria: 'Выводится 20.', starterCode: '// Создай let age = 20 и выведи через console.log\n', expectedOutput: ['20'], hints: ['let age = 20; console.log(age);'] }
  ]
};
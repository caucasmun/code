export const lesson11Strings = {
  id: 'strings',
  slug: 'strings',
  number: 11,
  title: 'Строки',
  subtitle: 'Работа с текстом',
  icon: '🔤',
  duration: 5,
  topics: ['строки', 'конкатенация', 'методы'],
  intro: 'Текст в JavaScript — это строки. С ними можно делать много всего полезного.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться работать со строками.' },
    { title: '🌍 Пример из жизни', text: 'Бусы из букв: можно нанизывать новые, считать их, менять регистр.' },
    { title: '💡 Объяснение', text: 'Строки склеиваются через +. У строк есть длина (.length) и методы (например, .toUpperCase()).', code: 'const name = "Аня";\nconsole.log("Привет, " + name);\nconsole.log(name.length); // 3' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Склей строки', description: 'Склей "Я изучаю " и "JavaScript" и выведи.', criteria: 'Выводится "Я изучаю JavaScript".', starterCode: '// Твой код\n', expectedOutput: ['Я изучаю JavaScript'], hints: ['Используй +.'] },
    { id: 'p2', type: 'code', title: 'Длина строки', description: 'Выведи длину слова "Программирование".', criteria: 'Выводится 15.', starterCode: '// Твой код\n', expectedOutput: ['15'], hints: ['Используй .length.'] }
  ]
};
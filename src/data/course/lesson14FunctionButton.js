export const lesson14FunctionButton = {
  id: 'function-button',
  slug: 'function-button',
  number: 14,
  title: 'Функции',
  subtitle: 'Кнопка, которая делает работу',
  icon: '🔘',
  duration: 5,
  topics: ['function', 'вызов'],
  intro: 'Функция — это кнопка. Ты нажимаешь — она делает работу.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться создавать функции.' },
    { title: '🌍 Пример из жизни', text: 'Кнопка «Кофе» на кофемашине. Ты не думаешь, как она варит, — просто нажимаешь.' },
    { title: '💡 Объяснение', text: 'function имя() { ... } — создали кнопку. имя() — нажали.', code: 'function sayHello() {\n  console.log("Привет");\n}\nsayHello();' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Скажи Привет', description: 'Создай функцию sayHello, которая выводит "Привет". Вызови её.', criteria: 'Выводится "Привет".', starterCode: '// Твой код\n', expectedOutput: ['Привет'], hints: ['function sayHello() { console.log("Привет"); } sayHello();'] }
  ]
};
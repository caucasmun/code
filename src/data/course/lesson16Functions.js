export const lesson16Functions = {
  id: 'functions',
  slug: 'functions',
  number: 16,
  title: 'Функции с параметрами',
  subtitle: 'Передаём данные',
  icon: '🎛️',
  duration: 5,
  topics: ['параметры', 'аргументы', 'return'],
  intro: 'Параметры — это данные, которые мы передаём в функцию.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться передавать данные в функцию.' },
    { title: '🌍 Пример из жизни', text: 'Кнопка «Кофе с сахаром»: ты говоришь, сколько сахара добавить.' },
    { title: '💡 Объяснение', text: 'function greet(name) { return "Привет, " + name; }. greet("Аня") вернёт "Привет, Аня".', code: 'function greet(name) {\n  return "Привет, " + name;\n}\nconsole.log(greet("Аня"));' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Приветствие', description: 'Напиши функцию greet(name), которая возвращает "Привет, " + name.', criteria: 'Возвращает приветствие.', starterCode: 'function greet(name) {\n  // Твой код\n}\n', expectedOutput: ['Привет, Аня'], hints: ['return "Привет, " + name;'] }
  ]
};
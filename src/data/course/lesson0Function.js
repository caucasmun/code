export const lesson0Function = {
  id: 'function-button',
  slug: 'function-button',
  number: 14,
  title: 'function: кнопка, которая делает работу',
  subtitle: 'Упакованный код с именем',
  icon: '🔘',
  duration: 5,
  topics: ['function', 'параметры', 'вызов'],
  intro: 'Функция — это упакованный код с именем, который можно вызывать много раз. В этом уроке ты научишься создавать функции.',
  theory: [
    { title: '🎯 Цель урока', text: 'В этом уроке ты научишься создавать функции и вызывать их.' },
    { title: '🌍 Пример из жизни', text: 'Кнопка «Кофе» на кофемашине: ты не думаешь, как она варит — просто нажимаешь и получаешь результат. Функция — такая же кнопка для кода.' },
    { title: '💡 Объяснение', text: 'function создаёт кнопку, имя — как она называется, () — нажатие, {} — что происходит. Вызов: имя().', code: 'function greet() {\n  return "Привет!";\n}\n\nconsole.log(greet());' },
    { title: '⚠️ Частая ошибка новичка', text: 'Путать создание функции и вызов. function greet() {} — создали. greet() — нажали.' },
    { title: '🔗 Связь с прошлым уроком', text: 'В прошлом уроке мы отдавали результат через return, теперь упакуем код в функции.' },
    { title: '✅ Что ты теперь умеешь', text: 'Создавать функции; вызывать их; передавать параметры.' },
  ],
  practice: [
    { id: 'function-button', title: 'Квадрат числа', description: 'Напиши функцию square(n), которая возвращает n * n.', criteria: 'Функция возвращает квадрат.', starterCode: 'function square(n) {\n  // Напишите решение здесь\n\n}\n', functionName: 'square', tests: [ { args: [4], expected: 16, description: 'Четыре' }, { args: [3], expected: 9, description: 'Три' } ], hints: ['Верни n * n.'] },
    { id: 'function-button', title: 'Приветствие с параметром', description: 'Напиши функцию greet(name), которая возвращает "Привет, " + name.', criteria: 'Функция использует параметр.', starterCode: 'function greet(name) {\n  // Напишите решение здесь\n\n}\n', functionName: 'greet', tests: [ { args: ['Аня'], expected: 'Привет, Аня', description: 'Аня' }, { args: ['Борис'], expected: 'Привет, Борис', description: 'Борис' } ], hints: ['Верни "Привет, " + name.'] },
  ],
};
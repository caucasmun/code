export const lesson0For = {
  id: 'for-loop',
  slug: 'for-loop',
  number: 13,
  title: 'for: как повторить N раз',
  subtitle: 'Циклы',
  icon: '🔁',
  duration: 5,
  topics: ['for', 'i++', 'бесконечный цикл'],
  intro: 'Цикл for позволяет повторить действие N раз. В этом уроке ты научишься писать циклы.',
  theory: [
    { title: '🎯 Цель урока', text: 'В этом уроке ты научишься повторять действия через цикл for.' },
    { title: '🌍 Пример из жизни', text: 'Отжимания: «раз, два, три… десять». Ты не пишешь 10 команд — ты говоришь «повтори 10 раз».' },
    { title: '💡 Объяснение', text: 'for (let i = 1; i <= 5; i++) { ... }. i++ увеличивает счётчик. Забыть i++ — бесконечный цикл.', code: 'for (let i = 1; i <= 5; i++) {\n  console.log("Отжимание", i);\n}' },
    { title: '⚠️ Частая ошибка новичка', text: 'Забыть i++ — цикл станет бесконечным.' },
    { title: '🔗 Связь с прошлым уроком', text: 'В прошлом уроке принимали решения, теперь научимся повторять действия.' },
    { title: '✅ Что ты теперь умеешь', text: 'Писать цикл for; понимать три его части.' },
  ],
  practice: [
    { id: 'for-loop', title: 'Сумма от 1 до n', description: 'Напиши функцию sumTo(n), которая возвращает сумму чисел от 1 до n.', criteria: 'Функция возвращает сумму.', starterCode: 'function sumTo(n) {\n  // Напишите решение здесь\n\n}\n', functionName: 'sumTo', tests: [ { args: [5], expected: 15, description: 'До пяти' }, { args: [3], expected: 6, description: 'До трёх' } ], hints: ['Создай переменную total = 0 и цикл for.'] },
    { id: 'for-loop', title: 'Повтори слово', description: 'Напиши функцию repeatWord(word, times), которая возвращает word, повторённое times раз.', criteria: 'Функция повторяет слово.', starterCode: 'function repeatWord(word, times) {\n  // Напишите решение здесь\n\n}\n', functionName: 'repeatWord', tests: [ { args: ['А', 3], expected: 'ААА', description: 'Три раза' }, { args: ['кот', 2], expected: 'коткот', description: 'Два раза' } ], hints: ['Создай пустую строку и цикл.'] },
  ],
};
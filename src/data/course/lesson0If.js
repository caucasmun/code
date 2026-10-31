export const lesson0If = {
  id: 'lesson-0e',
  slug: 'if-else',
  number: 5,
  title: 'if/else: как выбрать путь',
  subtitle: 'Принятие решений',
  icon: '🔀',
  duration: 5,
  topics: ['if', 'else', 'сравнения'],
  intro: 'Условие позволяет программе выбирать путь. В этом уроке ты научишься писать if/else.',
  theory: [
    { title: '🎯 Цель урока', text: 'В этом уроке ты научишься принимать решения через if/else.' },
    { title: '🌍 Пример из жизни', text: '«Если на улице дождь — беру зонт, иначе — очки». Компьютер делает то же самое.' },
    { title: '💡 Объяснение', text: 'if (условие) { ... } else { ... }. === — строгое равенство. && — И, || — ИЛИ, ! — НЕ.', code: 'let rain = true;

if (rain) {
  console.log("Беру зонт");
} else {
  console.log("Беру очки");
}' },
    { title: '⚠️ Частая ошибка новичка', text: 'Писать = вместо ===. = — присваивание, === — сравнение.' },
    { title: '🔗 Связь с прошлым уроком', text: 'В прошлом уроке создавали функции, теперь научимся принимать решения внутри них.' },
    { title: '✅ Что ты теперь умеешь', text: 'Писать if/else; сравнивать числа; использовать логические операторы.' },
  ],
  practice: [
    { id: 'l0i-1', title: 'Взрослый ли', description: 'Напиши функцию isAdult(age), которая возвращает true, если age >= 18.', criteria: 'Функция возвращает true/false.', starterCode: 'function isAdult(age) {
  // Напишите решение здесь

}
', functionName: 'isAdult', tests: [ { args: [20], expected: true, description: 'Взрослый' }, { args: [10], expected: false, description: 'Ребёнок' }, { args: [18], expected: true, description: 'Граница' } ], hints: ['Верни age >= 18.'] },
    { id: 'l0i-2', title: 'Максимум из двух', description: 'Напиши функцию max(a, b), которая возвращает большее число.', criteria: 'Функция возвращает большее.', starterCode: 'function max(a, b) {
  // Напишите решение здесь

}
', functionName: 'max', tests: [ { args: [3, 9], expected: 9, description: 'Второе больше' }, { args: [12, 4], expected: 12, description: 'Первое больше' } ], hints: ['Используй if/else или тернарный оператор.'] },
  ],
};
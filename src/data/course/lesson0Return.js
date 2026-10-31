export const lesson0Return = {
  id: 'lesson-0c',
  slug: 'return-value',
  number: 3,
  title: 'return: как попросить компьютер отдать результат',
  subtitle: 'Показать vs вернуть',
  icon: '📦',
  duration: 5,
  topics: ['return', 'console.log', 'переменная'],
  intro: 'return отдаёт значение наружу, чтобы его можно было использовать дальше. В этом уроке ты поймёшь разницу между сказать и отдать.',
  theory: [
    { title: '🎯 Цель урока', text: 'В этом уроке ты поймёшь разницу между показать и вернуть.' },
    { title: '🌍 Пример из жизни', text: 'console.log — это кричать на кухню: ты слышишь ответ, но бутерброд не получаешь. return — это доставка: курьер приносит бутерброд в руки.' },
    { title: '💡 Объяснение', text: 'return отдаёт значение наружу. console.log только печатает и забывает.', code: 'function say() {
  console.log("Привет");
}

function give() {
  return "Привет";
}

let a = give();
console.log(a);' },
    { title: '⚠️ Частая ошибка новичка', text: 'Писать console.log там, где нужен return. Задача вернуть цену × 2 — это return, а не console.log.' },
    { title: '🔗 Связь с прошлым уроком', text: 'В прошлом уроке мы выводили текст, теперь научимся отдавать результат.' },
    { title: '✅ Что ты теперь умеешь', text: 'Понимать разницу между показать и вернуть.' },
  ],
  practice: [
    { id: 'l0r-1', title: 'Верни число', description: 'Напиши функцию getNumber(), которая возвращает число 5.', criteria: 'Функция возвращает 5.', starterCode: 'function getNumber() {
  // Напишите решение здесь

}
', functionName: 'getNumber', tests: [ { args: [], expected: 5, description: 'Без аргументов' } ], hints: ['Используй return 5.'] },
    { id: 'l0r-2', title: 'Сумма с return', description: 'Напиши функцию sum(a, b), которая возвращает сумму.', criteria: 'Функция возвращает сумму.', starterCode: 'function sum(a, b) {
  // Напишите решение здесь

}
', functionName: 'sum', tests: [ { args: [2, 3], expected: 5, description: 'Два плюс три' }, { args: [10, -4], expected: 6, description: 'С отрицательным' } ], hints: ['Верни a + b.'] },
  ],
};
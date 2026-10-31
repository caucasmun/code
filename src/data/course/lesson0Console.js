export const lesson0Console = {
  id: 'lesson-0b',
  slug: 'console-log',
  number: 2,
  title: 'console.log: как попросить компьютер сказать',
  subtitle: 'Вывод текста и чисел',
  icon: '📣',
  duration: 5,
  topics: ['console.log', 'кавычки', 'склейка'],
  intro: 'console.log — это способ попросить компьютер «сказать» что-то вслух. В этом уроке ты научишься выводить текст и числа.',
  theory: [
    { title: '🎯 Цель урока', text: 'В этом уроке ты научишься выводить текст и числа в консоль.' },
    { title: '🌍 Пример из жизни', text: 'console.log — это как сказать вслух. Ты думаешь «привет» — никто не слышит. Сказал вслух — услышали. Так и тут: компьютер «думает» число, а console.log его «произносит».' },
    { title: '💡 Объяснение', text: 'console.log("Привет") выведет Привет. console.log(42) выведет 42. Текст — в кавычках, числа — без. + склеивает текст и число.', code: 'console.log("Привет");
console.log(42);
console.log("Мне " + 25);' },
    { title: '⚠️ Частая ошибка новичка', text: 'Забыть кавычки у текста. console.log(Привет) — ошибка, console.log("Привет") — правильно.' },
    { title: '🔗 Связь с прошлым уроком', text: 'В прошлом уроке мы запустили код в консоли, теперь научимся выводить результат.' },
    { title: '✅ Что ты теперь умеешь', text: 'Выводить текст и числа; склеивать их через +.' },
  ],
  practice: [
    { id: 'l0c-1', title: 'Приветствие', description: 'Напиши функцию greet(name), которая возвращает строку "Привет, <имя>!".', criteria: 'Функция возвращает строку с приветствием.', starterCode: 'function greet(name) {
  // Напишите решение здесь

}
', functionName: 'greet', tests: [ { args: ['Аня'], expected: 'Привет, Аня!', description: 'Обычное имя' }, { args: ['Борис'], expected: 'Привет, Борис!', description: 'Другое имя' } ], hints: ['Верни "Привет, " + name + "!".'] },
    { id: 'l0c-2', title: 'Склей текст и число', description: 'Напиши функцию makePhrase(age), которая возвращает строку "Мне " + age + " лет".', criteria: 'Функция склеивает текст и число.', starterCode: 'function makePhrase(age) {
  // Напишите решение здесь

}
', functionName: 'makePhrase', tests: [ { args: [20], expected: 'Мне 20 лет', description: 'Двадцать' }, { args: [5], expected: 'Мне 5 лет', description: 'Пять' } ], hints: ['Верни "Мне " + age + " лет".'] },
  ],
};
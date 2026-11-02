export const lesson5FirstCommand = {
  id: 'first-command',
  slug: 'first-command',
  number: 5,
  title: 'Первая команда',
  subtitle: 'console.log',
  icon: '📣',
  duration: 5,
  topics: ['console.log', 'вывод'],
  intro: 'Самая главная команда — это вывод. С её помощью программа «говорит» с тобой.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться выводить текст и числа на экран.' },
    { title: '🌍 Пример из жизни', text: 'console.log — это как сказать вслух. Ты думаешь «Привет» — никто не слышит. Написал console.log("Привет") — компьютер произнёс это на экране.' },
    { title: '💡 Объяснение', text: 'Команда пишется так: console.log(...). Внутри скобок — то, что хотим показать. Текст обязательно в кавычках. Числа — без кавычек.', code: 'console.log("Привет, мир!");\nconsole.log(42);' },
    { title: '⚠️ Частая ошибка новичка', text: 'Забыть кавычки у текста. console.log(Привет) — ошибка, компьютер не поймёт.' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Выведи приветствие', description: 'Напиши команду, которая выводит строку "Привет!".', criteria: 'В консоли появляется "Привет!".', starterCode: '// Напиши свой код здесь\n', expectedOutput: ['Привет!'], hints: ['Используй console.log("Привет!");'] },
    { id: 'p2', type: 'code', title: 'Выведи число', description: 'Выведи число 100.', criteria: 'В консоли появляется 100.', starterCode: '// Напиши свой код здесь\n', expectedOutput: ['100'], hints: ['Числа пишутся без кавычек: console.log(100);'] }
  ]
};
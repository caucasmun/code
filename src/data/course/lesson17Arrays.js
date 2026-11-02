export const lesson17Arrays = {
  id: 'arrays',
  slug: 'arrays',
  number: 17,
  title: 'Массивы',
  subtitle: 'Списки данных',
  icon: '📚',
  duration: 5,
  topics: ['массивы', 'push', 'индексы'],
  intro: 'Массив — это упорядоченный список значений.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться хранить списки данных.' },
    { title: '🌍 Пример из жизни', text: 'Список покупок: хлеб, молоко, яйца.' },
    { title: '💡 Объяснение', text: 'Массив создаётся квадратными скобками. Элементы нумеруются с нуля. push добавляет элемент в конец.', code: 'const items = ["яблоко", "груша"];\nitems.push("слива");\nconsole.log(items[0]); // "яблоко"' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Создай массив', description: 'Создай массив из трёх любимых фильмов и выведи первый.', criteria: 'Выводится название первого фильма.', starterCode: '// Твой код\n', expectedOutput: ['Фильм 1'], hints: ['const films = ["Фильм 1", "Фильм 2", "Фильм 3"]; console.log(films[0]);'] }
  ]
};
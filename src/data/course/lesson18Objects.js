export const lesson18Objects = {
  id: 'objects',
  slug: 'objects',
  number: 18,
  title: 'Объекты',
  subtitle: 'Карточки с данными',
  icon: '🎮',
  duration: 5,
  topics: ['объекты', 'свойства'],
  intro: 'Объект — это «карточка» с полями. Удобно хранить связанные данные.',
  theory: [
    { title: '🎯 Цель урока', text: 'Научиться создавать объекты.' },
    { title: '🌍 Пример из жизни', text: 'Анкета: имя, возраст, город — всё в одной карточке.' },
    { title: '💡 Объяснение', text: 'Объект создаётся фигурными скобками. Поля называются свойствами. Доступ через точку.', code: 'const user = { name: "Аня", age: 25 };\nconsole.log(user.name); // "Аня"' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Создай объект', description: 'Создай объект book с полями title и author. Выведи title.', criteria: 'Выводится название книги.', starterCode: '// Твой код\n', expectedOutput: ['Название'], hints: ['const book = { title: "Название", author: "Автор" }; console.log(book.title);'] }
  ]
};
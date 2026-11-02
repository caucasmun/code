/**
 * Урок 4. Объекты — состояние игры.
 */

export const lessonObjects = {
  id: 'objects',
  slug: 'objects',
  number: 18,
  title: 'Объекты и состояние игры',
  subtitle: 'Храним всё, что нужно игре',
  icon: '🎮',
  duration: 18,
  topics: ['объекты', 'свойства', 'вложенность', 'деструктуризация'],
  intro:
    'Игра — это набор меняющихся данных: счёт, здоровье, выбранная карта. В JavaScript их удобно хранить в объекте — одном «ящике» с именованными полями. Этот урок — про то, как организовать состояние так, чтобы с ним было легко работать.',
  theory: [
    {
      title: '🎯 Цель урока',
      text:
        'В этом уроке ты научишься хранить связанные данные вместе в одном объекте.',
    },
    {
      title: '🌍 Пример из жизни',
      text:
        'Анкета: имя, возраст, город — всё в одной «карточке». Объект в JS — такая же карточка с полями.',
    },
    {
      title: 'Создание объекта',
      text: 'Объект создаётся фигурными скобками, а поля называются свойствами. Обращение: state.score. Значение может быть любым — числом, строкой, массивом или вложенным объектом.',
      code: `const state = {
  score: 0,
  lives: 3,
  player: { name: "Аня", level: 1 },
};

state.score = state.score + 10;
state.player.level;   // 1`,
    },
    {
      title: 'Создание копии',
      text: 'Присваивание объекта копирует только ссылку. Чтобы получить независимую копию, используйте spread. Это основа неизменяемого обновления состояния, которое применяют в React.',
      code: `const oldState = { score: 0, lives: 3 };
const newState = { ...oldState, score: 1 };

oldState.score;   // 0 — старый объект не изменился
newState.score;   // 1`,
    },
    {
      title: 'Деструктуризация',
      text: 'Деструктуризация позволяет достать несколько свойств одной строкой. В играх это удобно, когда функция получает объект состояния.',
      code: `function draw({ score, lives }) {
  console.log(\`Счёт: \${score}, жизни: \${lives}\`);
}

draw({ score: 10, lives: 2 });`,
    },
    {
      title: '⚠️ Частая ошибка новичка',
      text:
        'Путать массив (список) и объект (карточка с полями).',
    },
    {
      title: '🔗 Связь с прошлым уроком',
      text:
        'В прошлом уроке работали со списками, теперь — с карточками данных.',
    },
    {
      title: '✅ Что ты теперь умеешь',
      text:
        'Создавать объекты; обращаться к свойствам; перебирать ключи.',
    },
  ],
  practice: [
    {
      id: 'objects',
      title: 'Счётчик очков',
      description:
        'Напишите функцию addPoints(state, points), которая возвращает новый объект состояния с увеличенным счётом. Исходный объект изменять нельзя.',
      criteria: 'Возвращается новый объект, исходный state не изменяется.',
      starterCode: `function addPoints(state, points) {
  // Напишите решение здесь

}
`,
      functionName: 'addPoints',
      tests: [
        { args: [{ score: 0, lives: 3 }, 10], expected: { score: 10, lives: 3 }, description: 'Добавляет очки' },
        { args: [{ score: 5, lives: 2 }, 3], expected: { score: 8, lives: 2 }, description: 'Сохраняет жизни' },
        { args: [{ score: 0, lives: 1 }, 0], expected: { score: 0, lives: 1 }, description: 'Прибавление нуля' },
      ],
      hints: [
        'Используйте spread: return { ...state, score: state.score + points };',
        'Проверка: исходный state.score должен остаться прежним после вызова функции.',
      ],
    },
    {
      id: 'objects',
      title: 'Игрок и противник',
      description:
        'Напишите функцию describePlayer(player), где player — объект с полями name и health. Функция возвращает строку вида «Аня: 80 здоровья».',
      criteria: 'Строка содержит имя и количество здоровья.',
      starterCode: `function describePlayer(player) {
  // Напишите решение здесь

}
`,
      functionName: 'describePlayer',
      tests: [
        { args: [{ name: 'Аня', health: 80 }], expected: 'Аня: 80 здоровья', description: 'Обычный игрок' },
        { args: [{ name: 'Бот', health: 0 }], expected: 'Бот: 0 здоровья', description: 'Нулевое здоровье' },
      ],
      hints: [
        'Используйте шаблонную строку: `...${player.name}...${player.health}...`.',
        'Внимание: в названии «здоровья» должно быть именно столько букв, сколько в образце.',
      ],
    },
    {
      id: 'objects',
      title: 'Есть ли предмет в инвентаре',
      description:
        'Напишите функцию hasItem(inventory, item), где inventory — массив названий предметов. Функция возвращает true, если предмет есть в списке.',
      criteria: 'Функция находит предмет в массиве и возвращает true или false.',
      starterCode: `function hasItem(inventory, item) {
  // Напишите решение здесь

}
`,
      functionName: 'hasItem',
      tests: [
        { args: [['меч', 'щит'], 'меч'], expected: true, description: 'Предмет есть' },
        { args: [['меч', 'щит'], 'зелье'], expected: false, description: 'Предмета нет' },
        { args: [[], 'меч'], expected: false, description: 'Пустой инвентарь' },
      ],
      hints: [
        'Готовый вариант: return inventory.includes(item);',
        'Метод includes возвращает true, если элемент найден в массиве.',
      ],
    },
  ],
};

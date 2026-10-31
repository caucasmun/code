/**
 * Урок 1. Переменные, константы и типы данных.
 */

export const lessonVariables = {
  id: 'lesson-3',
  slug: 'variables',
  number: 3,
  title: 'Переменные и типы данных',
  subtitle: 'Храним значения и учимся их запрашивать',
  icon: '📦',
  duration: 12,
  topics: ['let', 'const', 'typeof', 'строки', 'числа'],
  intro:
    'Переменная — это коробка с подписью. В JavaScript есть два способа объявить коробку: let (подпись можно менять) и const (подпись навсегда). Сегодня разберёмся, как это работает, и напишем первые функции.',
  theory: [
    {
      title: 'let и const',
      text: 'const означает «константа» — значение задаётся один раз и больше не меняется. let можно переприсваивать. В учебных задачах по умолчанию используйте const, а let — только когда значение действительно меняется.',
      code: `const MAX_LIVES = 3;   // изменить нельзя
let score = 0;          // можно увеличить
score = score + 1;`,
    },
    {
      title: 'Типы данных',
      text: 'В JavaScript есть три основных типа: number (числа), string (строки) и boolean (true/false). Тип можно узнать оператором typeof. Число и строка — разные вещи: "5" + 1 даст "51", а 5 + 1 даст 6.',
      code: `typeof 42;        // "number"
typeof "код";      // "string"
typeof true;       // "boolean"
"5" + 1;           // "51"  — строка
5 + 1;             // 6    — число`,
    },
    {
      title: 'Шаблонные строки',
      text: 'Чтобы вставить значение внутрь текста, используйте обратные кавычки и ${}. Это удобнее, чем склеивать строки через +, и не требует заранее знать тип значения.',
      code: `const name = "Аня";
const greeting = \`Привет, \${name}!\`;
console.log(greeting);   // Привет, Аня!`,
    },
  ],
  practice: [
    {
      id: 'v-1',
      title: 'Приветствие',
      description:
        'Напишите функцию createGreeting(name), которая возвращает строку «Привет, <имя>!». Например, createGreeting("Аня") должна вернуть «Привет, Аня!».',
      criteria: 'Функция возвращает строку с приветствием и восклицательным знаком.',
      starterCode: `function createGreeting(name) {
  // Напишите решение здесь

}
`,
      functionName: 'createGreeting',
      tests: [
        { args: ['Аня'], expected: 'Привет, Аня!', description: 'Обычное имя' },
        { args: ['Иван'], expected: 'Привет, Иван!', description: 'Другое имя' },
        { args: [''], expected: 'Привет, !', description: 'Пустое имя' },
      ],
      hints: [
        'Верните строку с шаблонными кавычками: `Привет, ${name}!`.',
        'Не забудьте слово return — без него функция вернёт undefined.',
      ],
    },
    {
      id: 'v-2',
      title: 'Тип значения',
      description:
        'Напишите функцию getType(value), которая возвращает строку с названием типа: "number", "string", "boolean" или "other" для остальных значений.',
      criteria: 'Функция различает числа, строки и логические значения.',
      starterCode: `function getType(value) {
  // Напишите решение здесь

}
`,
      functionName: 'getType',
      tests: [
        { args: [42], expected: 'number', description: 'Число' },
        { args: ['код'], expected: 'string', description: 'Строка' },
        { args: [true], expected: 'boolean', description: 'Логическое значение' },
        { args: [null], expected: 'other', description: 'null — это other' },
      ],
      hints: [
        'Используйте оператор typeof: typeof value возвращает "number", "string" или "boolean".',
        'Для остальных значений проверяйте typeof === "number" || typeof === "string" || typeof === "boolean".',
      ],
    },
    {
      id: 'v-3',
      title: 'Возрастная группа',
      description:
        'Напишите функцию getAgeGroup(age). Для возраста меньше 18 верните "child", от 18 до 64 включительно — "adult", а для 65 и старше — "senior".',
      criteria: 'Границы 18 и 65 обрабатываются правильно: 18 — adult, 65 — senior.',
      starterCode: `function getAgeGroup(age) {
  // Напишите решение здесь

}
`,
      functionName: 'getAgeGroup',
      tests: [
        { args: [10], expected: 'child', description: 'Ребёнок' },
        { args: [18], expected: 'adult', description: 'Граница 18' },
        { args: [30], expected: 'adult', description: 'Взрослый' },
        { args: [65], expected: 'senior', description: 'Граница 65' },
      ],
      hints: [
        'Проверяйте условия по порядку: сначала age < 18, потом age >= 65, иначе — взрослый.',
        'Условие «от 18 до 64» записывается как age >= 18 && age < 65.',
      ],
    },
  ],
};

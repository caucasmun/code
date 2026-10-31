/**
 * Урок 5. Строки — разбираем слова и символы.
 */

export const lessonStrings = {
  id: 'lesson-7',
  slug: 'strings',
  number: 7,
  title: 'Строки',
  subtitle: 'Работа с текстом: слова, буквы, регистр',
  icon: '🔤',
  duration: 14,
  topics: ['строки', 'split', 'trim', 'toUpperCase', 'includes'],
  intro:
    'Текст в JavaScript — строка. В играх со строками сталкиваются чаще всего: загаданное слово, ввод игрока, отображение счёта. Научимся разбирать строку на части, сравнивать и приводить к нужному регистру.',
  theory: [
    {
      title: 'Методы строк',
      text: 'У строк есть методы: length (длина), toUpperCase и toLowerCase (регистр), trim (убрать пробелы по краям), includes (проверка наличия подстроки).',
      code: `const word = "  Игра  ";
word.trim();          // "Игра"
word.toUpperCase();   // "  ИГРА  "
word.length;          // 8 — пробелы тоже считаются`,
    },
    {
      title: 'Разбор строки на части',
      text: 'Метод split разрезает строку по разделителю и возвращает массив. Обратное действие — join, который склеивает массив обратно в строку.',
      code: `"а,б,в".split(",");        // ["а", "б", "в"]
["а", "б", "в"].join("-"); // "а-б-в"
"код".split("");           // ["к", "о", "д"]`,
    },
    {
      title: 'Поиск и замена',
      text: 'Метод indexOf возвращает позицию подстроки или -1, если её нет. Метод replace заменяет первое вхождение, replaceAll — все вхождения.',
      code: `"камень-ножницы".indexOf("-");   // 6
"а-б-а".replace("-", "+");           // "а+б-а"
"а-б-а".replaceAll("-", "+");        // "а+б+а"`,
    },
  ],
  practice: [
    {
      id: 's-1',
      title: 'Сколько букв',
      description:
        'Напишите функцию countLetters(text), которая возвращает количество букв в строке, не считая пробелов.',
      criteria: 'Пробелы не учитываются, остальные символы считаются.',
      starterCode: `function countLetters(text) {
  // Напишите решение здесь

}
`,
      functionName: 'countLetters',
      tests: [
        { args: ['игра'], expected: 4, description: 'Одно слово' },
        { args: ['код в игре'], expected: 9, description: 'Три слова' },
        { args: [''], expected: 0, description: 'Пустая строка' },
      ],
      hints: [
        'Разбейте строку по пробелу: text.split(" ") и посчитайте длины частей.',
        'Альтернатива: text.replace(/\\s/g, "").length.',
      ],
    },
    {
      id: 's-2',
      title: 'Проверка слова',
      description:
        'Напишите функцию isPalindrome(word), которая возвращает true, если слово читается одинаково в обе стороны. Регистр не учитывайте.',
      criteria: 'Регистр игнорируется, результат — true или false.',
      starterCode: `function isPalindrome(word) {
  // Напишите решение здесь

}
`,
      functionName: 'isPalindrome',
      tests: [
        { args: ['шалаш'], expected: true, description: 'Палиндром' },
        { args: ['код'], expected: false, description: 'Не палиндром' },
        { args: ['Агата'], expected: true, description: 'С учётом регистра' },
      ],
      hints: [
        'Приведите строку к нижнему регистру: word.toLowerCase().',
        'Разверните строку: word.split("").reverse().join("").',
      ],
    },
    {
      id: 's-3',
      title: 'Скрываем слово',
      description:
        'Напишите функцию hideWord(word), которая заменяет все буквы слова на «*». Длина слова при этом сохраняется.',
      criteria: 'Возвращается строка из звёздочек той же длины, что и исходное слово.',
      starterCode: `function hideWord(word) {
  // Напишите решение здесь

}
`,
      functionName: 'hideWord',
      tests: [
        { args: ['КОД'], expected: '***', description: 'Три буквы' },
        { args: ['ИГРА'], expected: '****', description: 'Четыре буквы' },
        { args: [''], expected: '', description: 'Пустое слово' },
      ],
      hints: [
        'Метод repeat повторяет строку нужное число раз: "*".repeat(word.length).',
        'Готовое решение: return "*".repeat(word.length);',
      ],
    },
  ],
};

/**
 * Урок 6. Финальный — пишем игровую логику целиком.
 */

export const lessonGameLogic = {
  id: 'lesson-8',
  slug: 'game-logic',
  number: 8,
  title: 'Пишем игровую логику',
  subtitle: 'Собираем всё вместе: камень, ножницы, бумага',
  icon: '🏆',
  duration: 22,
  topics: ['чистые функции', 'случайный выбор', 'счёт', 'состояние'],
  intro:
    'Финальный урок — практика на полной скорости. Напишем логику игры «Камень, ножницы, бумага» ровно так, как она устроена в приложении: чистые функции, которые легко тестировать, и состояние, которое хранится отдельно.',
  theory: [
    {
      title: '🎯 Цель урока',
      text:
        'В этом уроке ты научишься применять все изученные приёмы для создания игровой логики.',
    },
    {
      title: '🌍 Пример из жизни',
      text:
        'Правила игры: если счёт >= 10 — победа, иначе продолжаем. Логика — это набор таких проверок.',
    },
    {
      title: 'Чистые функции',
      text: 'Чистая функция не меняет внешнее состояние и всегда возвращает один и тот же результат для одних и тех же аргументов. determineResult — именно такая функция: её можно проверить в любой момент.',
      code: `function determineResult(playerMove, computerMove) {
  if (playerMove === computerMove) return "draw";
  if (BEATS[playerMove] === computerMove) return "win";
  return "lose";
}`,
    },
    {
      title: 'Случайный выбор',
      text: 'Math.random() возвращает число от 0 до 1. Умножаем на длину массива и округляем вниз — получаем индекс случайного элемента.',
      code: `const MOVES = ["rock", "scissors", "paper"];
const index = Math.floor(Math.random() * MOVES.length);
const computerMove = MOVES[index];`,
    },
    {
      title: 'Состояние отдельно от логики',
      text: 'Игровая логика принимает состояние и возвращает новое — так её удобно тестировать. Интерфейс (React) сам решает, когда перерисовать поле.',
      code: `function playRound(state, playerMove) {
  const computerMove = getRandomMove(MOVES);
  const result = determineResult(playerMove, computerMove);

  return {
    ...state,
    score: updateScore(state.score, result),
    lastResult: result,
  };
}`,
    },
    {
      title: '⚠️ Частая ошибка новичка',
      text:
        'Забывать проверять граничные значения (0, 10, отрицательные).',
    },
    {
      title: '🔗 Связь с прошлым уроком',
      text:
        'В прошлом уроке работали со строками и данными, теперь объединим всё в логику игры.',
    },
    {
      title: '✅ Что ты теперь умеешь',
      text:
        'Строить условия для игры; работать с состоянием; проверять результат.',
    },
  ],
  practice: [
    {
      id: 'g-1',
      title: 'Кто победил',
      description:
        'Напишите функцию determineResult(playerMove, computerMove), которая возвращает "win", "lose" или "draw". Камень бьёт ножницы, ножницы бьют бумагу, бумага бьёт камень.',
      criteria: 'Все девять сочетаний ходов обрабатываются правильно.',
      starterCode: `function determineResult(playerMove, computerMove) {
  // Напишите решение здесь

}
`,
      functionName: 'determineResult',
      tests: [
        { args: ['rock', 'scissors'], expected: 'win', description: 'Камень бьёт ножницы' },
        { args: ['scissors', 'paper'], expected: 'win', description: 'Ножницы бьют бумагу' },
        { args: ['paper', 'rock'], expected: 'win', description: 'Бумага бьёт камень' },
        { args: ['rock', 'paper'], expected: 'lose', description: 'Камень проигрывает бумаге' },
        { args: ['rock', 'rock'], expected: 'draw', description: 'Ничья' },
      ],
      hints: [
        'Сначала проверьте ничью: if (playerMove === computerMove) return "draw";',
        'Опишите объект соответствий: const BEATS = { rock: "scissors", scissors: "paper", paper: "rock" };',
      ],
    },
    {
      id: 'g-2',
      title: 'Обновление счёта',
      description:
        'Напишите функцию updateScore(score, result), которая возвращает новый счёт: при победе +1, при поражении −1, при ничьей без изменений. Счёт не может уйти в минус.',
      criteria: 'Счёт увеличивается на 1, уменьшается на 1, но никогда не становится меньше нуля.',
      starterCode: `function updateScore(score, result) {
  // Напишите решение здесь

}
`,
      functionName: 'updateScore',
      tests: [
        { args: [0, 'win'], expected: 1, description: 'Победа' },
        { args: [3, 'lose'], expected: 2, description: 'Поражение' },
        { args: [3, 'draw'], expected: 3, description: 'Ничья' },
        { args: [0, 'lose'], expected: 0, description: 'Счёт не уходит в минус' },
      ],
      hints: [
        'Используйте Math.max(0, ...) для нижней границы счёта.',
        'Готовая заготовка: if (result === "win") return score + 1; if (result === "lose") return Math.max(0, score - 1); return score;',
      ],
    },
    {
      id: 'g-3',
      title: 'Полный раунд',
      description:
        'Напишите функцию playRound(score, playerMove, computerMove), которая возвращает новый счёт после раунда. Используйте логику определения победителя и обновления счёта.',
      criteria: 'Функция возвращает счёт после раунда с учётом результата.',
      starterCode: `function playRound(score, playerMove, computerMove) {
  // Напишите решение здесь

}
`,
      functionName: 'playRound',
      tests: [
        { args: [0, 'rock', 'scissors'], expected: 1, description: 'Победа в раунде' },
        { args: [5, 'rock', 'paper'], expected: 4, description: 'Поражение в раунде' },
        { args: [5, 'paper', 'paper'], expected: 5, description: 'Ничья в раунде' },
      ],
      hints: [
        'Внутри функции можно вызвать другие функции: const result = determineResult(playerMove, computerMove);',
        'Затем верните updateScore(score, result).',
      ],
    },
  ],
};

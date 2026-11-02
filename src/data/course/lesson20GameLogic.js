export const lesson20GameLogic = {
  id: 'game-logic',
  slug: 'game-logic',
  number: 20,
  title: 'Игровая логика',
  subtitle: 'Собираем всё вместе',
  icon: '🏆',
  duration: 10,
  topics: ['функции', 'условия', 'циклы', 'игры'],
  intro: 'Финальный урок — применим всё, что выучили, для создания игровой логики.',
  theory: [
    { title: '🎯 Цель урока', text: 'Применить знания для игровой логики.' },
    { title: '🌍 Пример из жизни', text: 'Правила игры: если счёт >= 10 — победа. Логика — это набор проверок.' },
    { title: '💡 Объяснение', text: 'Мы используем функции, условия и переменные, чтобы описать правила игры.', code: 'function checkWin(score) {\n  if (score >= 10) return "Победа";\n  return "Играем дальше";\n}' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Проверка победы', description: 'Напиши функцию checkWin(score), которая возвращает "Победа", если score >= 10, иначе "Играем дальше".', criteria: 'Функция возвращает правильную строку.', starterCode: 'function checkWin(score) {\n  // Твой код\n}\n', expectedOutput: ['Победа'], hints: ['Используй if (score >= 10) return "Победа";'] }
  ]
};
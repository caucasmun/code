export const lesson15Return = {
  id: 'return-value',
  slug: 'return-value',
  number: 15,
  title: 'Возврат значений (return)',
  subtitle: 'Отдать результат',
  icon: '📦',
  duration: 5,
  topics: ['return', 'console.log'],
  intro: 'return отдаёт значение наружу. console.log просто печатает.',
  theory: [
    { title: '🎯 Цель урока', text: 'Понять разницу между console.log и return.' },
    { title: '🌍 Пример из жизни', text: 'console.log — крикнуть на кухню: «Я хочу бутерброд!». return — доставка: курьер принёс бутерброд в руки.' },
    { title: '💡 Объяснение', text: 'return отдаёт значение. Его можно сохранить в переменную и использовать.', code: 'function give() {\n  return "Привет";\n}\nlet a = give();\nconsole.log(a);' }
  ],
  practice: [
    { id: 'p1', type: 'code', title: 'Верни число', description: 'Напиши функцию getNumber(), которая возвращает 5.', criteria: 'Функция возвращает 5.', starterCode: 'function getNumber() {\n  // Твой код\n}\n', expectedOutput: ['5'], hints: ['return 5;'] }
  ]
};
import { lesson1WhatIsCode } from './lesson1WhatIsCode';
import { lesson2Algorithm } from './lesson2Algorithm';
import { lesson3WhatIsCode } from './lesson3WhatIsCode';
import { lesson4HowToRun } from './lesson4HowToRun';
import { lesson5FirstCommand } from './lesson5FirstCommand';
import { lesson6Comments } from './lesson6Comments';
import { lesson7Statements } from './lesson7Statements';
import { lesson8SyntaxErrors } from './lesson8SyntaxErrors';
import { lesson9WhatIsVariable } from './lesson9WhatIsVariable';
import { lesson10Math } from './lesson10Math';
import { lesson11Strings } from './lesson11Strings';
import { lesson12IfElse } from './lesson12IfElse';
import { lesson13ForLoop } from './lesson13ForLoop';
import { lesson14FunctionButton } from './lesson14FunctionButton';
import { lesson15Return } from './lesson15Return';
import { lesson16Functions } from './lesson16Functions';
import { lesson17Arrays } from './lesson17Arrays';
import { lesson18Objects } from './lesson18Objects';
import { lesson19ReadingTests } from './lesson19ReadingTests';
import { lesson20GameLogic } from './lesson20GameLogic';

/**
 * Вводный курс по JavaScript.
 *
 * Уроки идут от простого к сложному и готовят к заданиям в играх.
 * Каждый урок содержит теорию с примерами кода и практику
 * с автопроверкой через тест-кейсы.
 */
export const courseLessons = [
  lesson1WhatIsCode,
  lesson2Algorithm,
  lesson3WhatIsCode,
  lesson4HowToRun,
  lesson5FirstCommand,
  lesson6Comments,
  lesson7Statements,
  lesson8SyntaxErrors,
  lesson9WhatIsVariable,
  lesson10Math,
  lesson11Strings,
  lesson12IfElse,
  lesson13ForLoop,
  lesson14FunctionButton,
  lesson15Return,
  lesson16Functions,
  lesson17Arrays,
  lesson18Objects,
  lesson19ReadingTests,
  lesson20GameLogic,
];

/** Общее количество уроков — используется в статистике. */
export const TOTAL_LESSONS = courseLessons.length;

/** Общее количество практических заданий во всём курсе. */
export const TOTAL_COURSE_TASKS = courseLessons.reduce(
  (total, lesson) => total + lesson.practice.length,
  0,
);

/** Находит урок по его адресному идентификатору (slug). */
export function getLessonBySlug(slug) {
  return courseLessons.find((lesson) => lesson.slug === slug) || null;
}

/** Возвращает урок по порядковому номеру (начиная с 1). */
export function getLessonByNumber(number) {
  return courseLessons.find((lesson) => lesson.number === number) || null;
}

/** Следующий урок после указанного (или null, если это последний). */
export function getNextLesson(slug) {
  const index = courseLessons.findIndex((lesson) => lesson.slug === slug);

  if (index === -1 || index === courseLessons.length - 1) return null;

  return courseLessons[index + 1];
}

/** Предыдущий урок перед указанным (или null, если это первый). */
export function getPreviousLesson(slug) {
  const index = courseLessons.findIndex((lesson) => lesson.slug === slug);

  if (index <= 0) return null;

  return courseLessons[index - 1];
}

/**
 * Идентификаторы всех заданий курса в формате «lessonSlug/taskId».
 * По ним прогресс курса сохраняется в localStorage.
 */
export function getCourseTaskIds() {
  return courseLessons.flatMap((lesson) =>
    lesson.practice.map((task) => `${lesson.slug}/${task.id}`),
  );
}

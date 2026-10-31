import { lesson0Launch } from './lesson0Launch';
import { lessonProgramming } from './lessonProgramming';
import { lessonBasics } from './lessonBasics';
import { lessonVariables } from './lessonVariables';
import { lessonFunctions } from './lessonFunctions';
import { lessonArrays } from './lessonArrays';
import { lessonObjects } from './lessonObjects';
import { lessonStrings } from './lessonStrings';
import { lessonGameLogic } from './lessonGameLogic';

/**
 * Вводный курс по JavaScript.
 *
 * Уроки идут от простого к сложному и готовят к заданиям в играх.
 * Каждый урок содержит теорию с примерами кода и практику
 * с автопроверкой через тест-кейсы.
 */
export const courseLessons = [
  lesson0Launch,
  lesson0Console,
  lesson0Comments,
  lesson0Statements,
  lesson0SyntaxErrors,
  lesson0TestOutput,
  lesson0Return,
  lesson0Function,
  lesson0If,
  lesson0For,
  lessonAlgorithm,
  lessonProgramming,
  lessonBasics,
  lessonVariables,
  lessonOperators,

  lessonFunctions,
  lessonArrays,
  lessonObjects,
  lessonStrings,
  lessonGameLogic,
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

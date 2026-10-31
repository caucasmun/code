import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CodeBlock from '../components/CodeBlock';
import CodeTask from '../components/CodeTask';
import ProgressBar from '../components/ProgressBar';
import useCourseProgress from '../hooks/useCourseProgress';
import {
  courseLessons,
  getLessonBySlug,
  getNextLesson,
  getPreviousLesson,
  TOTAL_COURSE_TASKS,
  TOTAL_LESSONS,
} from '../data/course';

/**
 * Страница одного урока вводного курса.
 *
 * Урок состоит из теории (с примерами кода) и практики
 * с автопроверкой решения.
 */
export default function CourseLessonPage() {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const user = useSelector((state) => state.auth.user);

  const { canEdit, isTaskCompleted, lessonCompletedIds, storageWarning, toggleTaskCompletion } =
    useCourseProgress(slug);

  useEffect(() => {
    document.title = lesson ? `${lesson.title} — Курс JavaScript` : 'Урок не найден — Код в игре';
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="course-page">
        <p className="alert alert--warning">Такого урока нет. Загляните в список уроков.</p>
        <Link to="/course" className="button button--primary">
          К списку уроков
        </Link>
      </div>
    );
  }

  const nextLesson = getNextLesson(slug);
  const previousLesson = getPreviousLesson(slug);
  const lessonDone = lessonCompletedIds.length;

  return (
    <div className="course-page">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link to="/">Все игры</Link>
        <span aria-hidden="true">/</span>
        <Link to="/course">Курс</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          Урок {lesson.number}: {lesson.title}
        </span>
      </nav>

      <header className="course-page__header">
        <div className="course-page__heading">
          <span className="course-page__icon" aria-hidden="true">
            {lesson.icon}
          </span>
          <div>
            <p className="course-page__eyebrow">Урок {lesson.number} из {TOTAL_LESSONS}</p>
            <h1 className="course-page__title">{lesson.title}</h1>
            <p className="course-page__subtitle">{lesson.subtitle}</p>
          </div>
        </div>

        <div className="course-page__meta">
          <span className="tag">⏱ {lesson.duration} мин</span>
          {lesson.topics.map((topic) => (
            <span key={topic} className="tag">
              {topic}
            </span>
          ))}
        </div>
      </header>

      <p className="course-page__intro">{lesson.intro}</p>

      {storageWarning ? (
        <p className="alert alert--warning" role="alert">
          {storageWarning}
        </p>
      ) : null}

      {!user ? (
        <p className="alert alert--info">
          Проходить уроки и проверять код можно и без аккаунта, но сохранять отметки о выполнении — нет.{' '}
          <Link to="/register">Зарегистрируйтесь</Link>, чтобы не терять прогресс.
        </p>
      ) : null}

      <section className="course-page__theory" aria-labelledby="theory-title">
        <h2 id="theory-title" className="section-title">
          Теория
        </h2>

        {lesson.theory.map((block, index) => (
          <article key={block.title} className="course-block">
            <h3 className="course-block__title">
              <span className="course-block__number">{index + 1}</span>
              {block.title}
            </h3>
            <p className="course-block__text">{block.text}</p>
            {block.code ? <CodeBlock code={block.code} /> : null}
          </article>
        ))}
      </section>

      <section className="course-page__practice" aria-labelledby="practice-title">
        <h2 id="practice-title" className="section-title">
          Практика
        </h2>

        <ProgressBar value={lessonDone} max={lesson.practice.length} label="Решено заданий" />

        {lesson.practice.map((task) => (
          <CodeTask
            key={task.id}
            task={task}
            isCompleted={isTaskCompleted(task.id)}
            onSolved={() => {
              if (canEdit && !isTaskCompleted(task.id)) {
                toggleTaskCompletion(task.id);
              }
            }}
          />
        ))}
      </section>

      <nav className="course-page__navigation" aria-label="Переход между уроками">
        {previousLesson ? (
          <Link to={`/course/${previousLesson.slug}`} className="button button--ghost">
            ← Урок {previousLesson.number}: {previousLesson.title}
          </Link>
        ) : (
          <Link to="/course" className="button button--ghost">
            ← К списку уроков
          </Link>
        )}

        {nextLesson ? (
          lessonDone >= lesson.practice.length ? (
            <Link to={`/course/${nextLesson.slug}`} className="button button--primary">
              Урок {nextLesson.number}: {nextLesson.title} →
            </Link>
          ) : (
            <button type="button" className="button button--primary" disabled aria-disabled="true">
              Урок {nextLesson.number}: {nextLesson.title} →
            </button>
          )
        ) : (
          <Link to="/games" className="button button--primary">
            Перейти к играм →
          </Link>
        )}
      </nav>
    </div>
  );
}

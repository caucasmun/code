import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProgressBar from '../components/ProgressBar';
import { courseLessons, TOTAL_COURSE_TASKS, TOTAL_LESSONS } from '../data/course';

/**
 * Страница вводного курса: список уроков и общий прогресс.
 */
export default function CoursePage() {
  const completedTasks = useSelector((state) => state.course.completedTasks);

  useEffect(() => {
    document.title = 'Курс JavaScript — Код в игре';
  }, []);

  // Сколько заданий каждого урока уже выполнено.
  const lessonStats = useMemo(() => {
    const stats = {};

    courseLessons.forEach((lesson) => {
      const prefix = `${lesson.slug}/`;
      const done = completedTasks.filter((id) => id.startsWith(prefix)).length;

      stats[lesson.slug] = {
        done,
        total: lesson.practice.length,
        complete: done === lesson.practice.length && lesson.practice.length > 0,
      };
    });

    return stats;
  }, [completedTasks]);

  const doneTotal = completedTasks.length;
  const percent = TOTAL_COURSE_TASKS
    ? Math.round((doneTotal / TOTAL_COURSE_TASKS) * 100)
    : 0;

  return (
    <div className="course-page">
      <header className="course-page__header course-page__header--list">
        <div className="course-page__heading">
          <span className="course-page__icon" aria-hidden="true">
            🎓
          </span>
          <div>
            <p className="course-page__eyebrow">Вводный курс</p>
            <h1 className="course-page__title">JavaScript с нуля</h1>
            <p className="course-page__subtitle">
              {TOTAL_LESSONS} уроков и {TOTAL_COURSE_TASKS} практических заданий — от переменных до
              игровой логики.
            </p>
          </div>
        </div>
      </header>

      <section className="course-benefits" aria-labelledby="benefits-title">
        <h2 id="benefits-title" className="section-title">
          Чему вы научитесь
        </h2>
        <div className="course-benefits__grid">
          <div className="course-benefit">
            <span className="course-benefit__icon" aria-hidden="true">🧠</span>
            <p className="course-benefit__text">Мышлению: разбивать задачи на шаги</p>
          </div>
          <div className="course-benefit">
            <span className="course-benefit__icon" aria-hidden="true">📦</span>
            <p className="course-benefit__text">Работать с переменными и данными</p>
          </div>
          <div className="course-benefit">
            <span className="course-benefit__icon" aria-hidden="true">🔀</span>
            <p className="course-benefit__text">Управлять логикой через условия</p>
          </div>
          <div className="course-benefit">
            <span className="course-benefit__icon" aria-hidden="true">🔁</span>
            <p className="course-benefit__text">Повторять действия циклами</p>
          </div>
          <div className="course-benefit">
            <span className="course-benefit__icon" aria-hidden="true">🧩</span>
            <p className="course-benefit__text">Писать функции и переиспользовать код</p>
          </div>
          <div className="course-benefit">
            <span className="course-benefit__icon" aria-hidden="true">🎮</span>
            <p className="course-benefit__text">Создавать логику мини-игр</p>
          </div>
        </div>
      </section>

      <section className="course-page__summary" aria-label="Прогресс курса">
        <ProgressBar value={doneTotal} max={TOTAL_COURSE_TASKS} label="Решено заданий" />
        <p className="course-page__summary-note">Общий процент: {percent}%</p>
      </section>

      <ol className="course-list">
        {courseLessons.map((lesson) => {
          const stat = lessonStats[lesson.slug];

          return (
            <li key={lesson.id} className="course-list__item">
              <Link to={`/course/${lesson.slug}`} className="course-card">
                <div className="course-card__header">
                  <span className="course-card__icon" aria-hidden="true">
                    {lesson.icon}
                  </span>
                  <div className="course-card__heading">
                    <p className="course-card__number">Урок {lesson.number}</p>
                    <h2 className="course-card__title">{lesson.title}</h2>
                    <p className="course-card__subtitle">{lesson.subtitle}</p>
                  </div>
                  {stat.complete ? <span className="badge badge--success">Пройден</span> : null}
                </div>

                <p className="course-card__intro">{lesson.intro}</p>

                <ul className="course-card__topics">
                  {lesson.topics.map((topic) => (
                    <li key={topic} className="tag">
                      {topic}
                    </li>
                  ))}
                </ul>

                <ProgressBar
                  value={stat.done}
                  max={stat.total}
                  label="Заданий"
                  hint={`⏱ ${lesson.duration} мин`}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

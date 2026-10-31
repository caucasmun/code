/**
 * Список практических заданий по игре.
 *
 * Отметка о выполнении хранится в Redux и привязана к аккаунту,
 * поэтому гость видит задания, но не может их отмечать.
 */
export default function TaskList({ tasks, completedTaskIds = [], canEdit = false, onToggle }) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <p className="tasks__empty">Для этой игры задания пока не добавлены.</p>;
  }

  return (
    <ul className="tasks">
      {tasks.map((task) => {
        const isDone = completedTaskIds.includes(task.id);

        return (
          <li key={task.id} className={`tasks__item ${isDone ? 'tasks__item--done' : ''}`.trim()}>
            <div className="tasks__item-header">
              {canEdit ? (
                <label className="tasks__checkbox">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggle && onToggle(task.id)}
                    aria-label={`Отметить задание «${task.title}»`}
                  />
                  <span className="tasks__title">{task.title}</span>
                </label>
              ) : (
                <span className="tasks__title">
                  <span className="visually-hidden">{isDone ? 'Выполнено: ' : 'Не выполнено: '}</span>
                  {task.title}
                </span>
              )}

              {isDone ? <span className="badge badge--success">Выполнено</span> : null}
            </div>

            <p className="tasks__description">{task.description}</p>

            {task.criteria ? (
              <p className="tasks__criteria">
                <strong>Критерий: </strong>
                {task.criteria}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

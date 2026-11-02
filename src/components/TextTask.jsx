import { useState } from 'react';

/**
 * Блок текстового теста: вопрос и кнопки с вариантами ответа.
 *
 * @param {object} task Задание с полями type: 'text', description, options, correctOptionIndex, hints.
 * @param {boolean} [isCompleted] Отмечено ли задание как выполненное.
 * @param {function} [onSolved] Вызывается, когда выбран правильный вариант.
 */
export default function TextTask({ task, isCompleted = false, onSolved }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const isCorrect = selectedIndex === task.correctOptionIndex;

  const handleOptionClick = (index) => {
    setSelectedIndex(index);
    if (index === task.correctOptionIndex) {
      setFeedback('correct');
      if (onSolved) onSolved(task.id);
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="practice text-task">
      <div className="practice__description">
        <h4 className="practice__title">{task.title}</h4>
        <p className="practice__text">{task.description}</p>

        {task.criteria ? (
          <p className="practice__criteria">
            <strong>Критерий: </strong>
            {task.criteria}
          </p>
        ) : null}

        {feedback && (
          <div
            className={`feedback ${feedback === 'correct' ? 'feedback--success' : 'feedback--error'}`}
            role="status"
            aria-live="polite"
          >
            <p className="feedback__title">
              {feedback === 'correct' ? 'Верно! 🎉' : 'Неправильно, попробуйте ещё раз.'}
            </p>
            {feedback === 'wrong' && task.hints && task.hints.length > 0 ? (
              <p className="feedback__text">Подсказка: {task.hints[0]}</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="task-options">
        {task.options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`task-option-btn ${
              selectedIndex !== null
                ? index === task.correctOptionIndex
                  ? 'correct'
                  : index === selectedIndex
                    ? 'incorrect'
                    : ''
                : ''
            }`}
            onClick={() => handleOptionClick(index)}
            disabled={selectedIndex !== null || isCompleted}
          >
            {option}
          </button>
        ))}
      </div>

      {isCompleted ? <span className="badge badge--success">Выполнено</span> : null}
    </div>
  );
}
import { useState } from 'react';
import CodeTask from './CodeTask';
import TextTask from './TextTask';

/**
 * Блок практики: диспетчер между двумя типами заданий.
 *
 * - type: 'text' — текстовый тест с вариантами ответа (кнопки)
 * - type: 'code' (или отсутствует) — редактор кода с автопроверкой
 *
 * @param {object} task Задание.
 * @param {boolean} [isCompleted] Отмечено ли задание как выполненное.
 * @param {function} [onSolved] Вызывается, когда задание решено.
 */
export default function PracticeBlock({ task, isCompleted = false, onSolved }) {
  const isTextTask = task.type === 'text';

  return (
    <div className="practice-block">
      {isTextTask ? (
        <TextTask
          task={task}
          isCompleted={isCompleted}
          onSolved={onSolved}
        />
      ) : (
        <CodeTask
          task={task}
          isCompleted={isCompleted}
          onSolved={onSolved}
        />
      )}
    </div>
  );
}
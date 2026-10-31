import { useEffect, useMemo, useRef } from 'react';
import CodeBlock from './CodeBlock';

/**
 * Редактор кода с нумерацией строк и подсветкой строки с ошибкой.
 *
 * Сделан на обычном textarea: это надёжно работает без внешних
 * зависимостей, поддерживает вставку из буфера, автодополнение браузера
 * и доступен с клавиатуры.
 *
 * @param {string} value Текст кода.
 * @param {function} onChange Обработчик изменения.
 * @param {number} [errorLine] Номер строки с ошибкой — подсвечивается.
 * @param {string} [label] Подпись поля для скринридеров.
 * @param {boolean} [readOnly] Запрет редактирования.
 */
export default function CodeEditor({
  value,
  onChange,
  errorLine = null,
  label = 'Редактор кода',
  readOnly = false,
  minRows = 10,
}) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const lines = useMemo(() => (typeof value === 'string' ? value : '').split('\n'), [value]);

  // Прокрутка номера строк синхронна с прокруткой текста.
  useEffect(() => {
    const textarea = textareaRef.current;
    const gutter = gutterRef.current;

    if (!textarea || !gutter) return undefined;

    const sync = () => {
      gutter.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener('scroll', sync);
    return () => textarea.removeEventListener('scroll', sync);
  }, []);

  const handleKeyDown = (event) => {
    // Tab должен вставлять отступ, а не уводить фокус из редактора.
    if (event.key !== 'Tab' || readOnly) return;

    event.preventDefault();

    const textarea = event.target;
    const { selectionStart, selectionEnd } = textarea;
    const current = textarea.value;

    const next = `${current.slice(0, selectionStart)}  ${current.slice(selectionEnd)}`;

    onChange(next);
    requestAnimationFrame(() => {
      textarea.selectionStart = selectionStart + 2;
      textarea.selectionEnd = selectionStart + 2;
    });
  };

  return (
    <div className={`code-editor ${errorLine ? 'code-editor--has-error' : ''}`.trim()}>
      <div className="code-editor__gutter" ref={gutterRef} aria-hidden="true">
        {lines.map((_, index) => (
          <span
            key={index}
            className={`code-editor__line-number ${
              errorLine === index + 1 ? 'code-editor__line-number--error' : ''
            }`.trim()}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="code-editor__textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label={label}
        rows={minRows}
      />
    </div>
  );
}

/**
 * Блок с кодом и кнопкой «Скопировать» — используется в подсказках курса.
 */
export function CopyableCode({ code }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      // Буфер обмена может быть недоступен — молча игнорируем.
    }
  };

  return (
    <div className="code-editor__preview">
      <CodeBlock code={code} />
      <button type="button" className="button button--ghost button--small" onClick={handleCopy}>
        Скопировать
      </button>
    </div>
  );
}

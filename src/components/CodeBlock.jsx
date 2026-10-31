import { useMemo } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Регистрируем язык JavaScript один раз на уровне модуля.
// Без регистрации Prism не знает грамматики и не подсветит код.
SyntaxHighlighter.registerLanguage('javascript', javascript);

/**
 * Компонент подсветки кода.
 *
 * Обёртка над react-syntax-highlighter со стилем oneDark —
 * он совпадает с тёмной темой приложения.
 */
export default function CodeBlock({ code, language = 'javascript', showLineNumbers = false, className = '' }) {
  // Пустая строка допустима: блок просто останется пустым.
  const source = typeof code === 'string' ? code : '';

  const customStyle = useMemo(
    () => ({
      margin: 0,
      padding: 'var(--space-md)',
      background: 'var(--bg-code)',
      borderRadius: 'var(--radius)',
      fontSize: '0.9rem',
      lineHeight: 1.5,
    }),
    [],
  );

  return (
    <div className={`code-block ${className}`.trim()}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={customStyle}
        showLineNumbers={showLineNumbers}
        wrapLongLines
        codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
      >
        {source}
      </SyntaxHighlighter>
    </div>
  );
}

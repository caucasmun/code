import { useState } from 'react';
import CodeBlock from './CodeBlock';

/**
 * Разбор исходного кода игры по шагам.
 *
 * Каждый шаг показывает фрагмент кода с подсветкой и объяснение
 * простыми словами, зачем он нужен.
 */
export default function CodeBreakdown({ breakdown = [], fullCode = '', fullCodeTitle = 'Исходный код игры' }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = Array.isArray(breakdown) ? breakdown : [];
  const step = steps[activeStep];

  return (
    <section className="breakdown" aria-labelledby="breakdown-title">
      <h2 id="breakdown-title" className="section-title">
        Разбор кода
      </h2>

      {steps.length > 0 ? (
        <div className="breakdown__layout">
          <ol className="breakdown__steps">
            {steps.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`breakdown__step ${index === activeStep ? 'breakdown__step--active' : ''}`.trim()}
                  onClick={() => setActiveStep(index)}
                  aria-current={index === activeStep ? 'step' : undefined}
                >
                  <span className="breakdown__step-number">{index + 1}</span>
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="breakdown__content">
            {step ? (
              <>
                <h3 className="breakdown__content-title">{step.title}</h3>
                <CodeBlock code={step.code} />
                <p className="breakdown__explain">{step.explain}</p>
                {step.example ? (
                  <p className="breakdown__example">
                    <strong>Пример: </strong>
                    {step.example}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {fullCode ? (
        <details className="breakdown__full">
          <summary>{fullCodeTitle}</summary>
          <CodeBlock code={fullCode} />
        </details>
      ) : null}
    </section>
  );
}

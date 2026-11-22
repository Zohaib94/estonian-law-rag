import { COPY } from '../constants/copy.ts';
import type { AnswerPanelProps } from '../types/components.ts';

export function AnswerPanel({ answer }: AnswerPanelProps) {
  return (
    <section className="answer-panel" aria-live="polite">
      <h2>{COPY.answerTitle}</h2>

      {!answer && <p className="muted">{COPY.noAnswer}</p>}

      {answer && !answer.answerable && <p className="not-covered">{COPY.notCovered}</p>}

      {answer && <p className="answer-text">{answer.text}</p>}

      {answer && answer.citations.length > 0 && (
        <p className="citations">
          {COPY.basedOn}{' '}
          {answer.citations.map((sectionNr) => (
            <a key={sectionNr} className="citation" href={`#section-${sectionNr}`}>
              § {sectionNr}
            </a>
          ))}
        </p>
      )}
    </section>
  );
}

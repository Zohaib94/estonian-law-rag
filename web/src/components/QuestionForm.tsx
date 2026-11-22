import type { FormEvent } from 'react';

import { COPY } from '../constants/copy.ts';
import { SAMPLE_QUESTIONS } from '../constants/sample-questions.ts';
import type { QuestionFormProps } from '../types/components.ts';

export function QuestionForm({ question, loading, error, onQuestionChange, onSubmit }: QuestionFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <label htmlFor="question">{COPY.questionLabel}</label>

      <textarea id="question" value={question} rows={3} onChange={(event) => onQuestionChange(event.target.value)} />

      <div className="samples">
        <span>{COPY.samplesLabel}</span>
        {SAMPLE_QUESTIONS.map((sample) => (
          <button key={sample} type="button" className="sample" onClick={() => onQuestionChange(sample)}>
            {sample}
          </button>
        ))}
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading || question.trim() === ''}>
        {loading ? COPY.submitting : COPY.submit}
      </button>
    </form>
  );
}

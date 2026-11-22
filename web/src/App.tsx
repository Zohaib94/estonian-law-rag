import { useState } from 'react';

import { ACTS } from '../../src/constants/acts.ts';
import type { AskResponse } from '../../src/types/api.ts';
import { AnswerPanel } from './components/AnswerPanel.tsx';
import { QuestionForm } from './components/QuestionForm.tsx';
import { SectionList } from './components/SectionList.tsx';
import { COPY } from './constants/copy.ts';
import { SAMPLE_QUESTIONS } from './constants/sample-questions.ts';
import { fetchAnswer } from './services/ask-api.ts';

export function App() {
  const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      setResult(await fetchAnswer(question));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : COPY.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>{COPY.title}</h1>
        <p>{COPY.intro}</p>
      </header>

      <QuestionForm
        question={question}
        loading={loading}
        error={error}
        onQuestionChange={setQuestion}
        onSubmit={handleSubmit}
      />

      {result && <AnswerPanel answer={result.answer} />}

      {result && <SectionList sections={result.sections} citations={result.answer?.citations ?? []} />}

      <footer className="page-footer">
        {COPY.disclaimer}{' '}
        {Object.values(ACTS).map((act, index) => (
          <span key={act.code}>
            {index > 0 && ', '}
            <a href={act.pageUrl}>{act.name}</a>
          </span>
        ))}
        .
      </footer>
    </main>
  );
}

import type { Answer } from './rag.ts';
import type { RetrievalMode } from './retrieval.ts';

// One hand-written test question. sections lists the sections that answer it, as "TLS § 97"; an empty list means
// no act answers it, so the right response is a refusal.
export interface GoldenQuestion {
  question: string;
  sections: string[];
}

export interface RetrievalResult {
  // The act the question belongs to: the act of its first expected section.
  actCode: string;
  expected: string[];
  // Section references in ranked order, per retrieval mode.
  ranked: Record<RetrievalMode, string[]>;
}

export interface AnswerResult {
  // Empty for a question no act answers.
  actCode: string | null;
  expected: string[];
  answer: Answer | null;
}

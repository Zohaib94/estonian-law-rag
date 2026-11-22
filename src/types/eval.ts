import type { Answer } from './rag.ts';
import type { RetrievalMode } from './retrieval.ts';

// One hand-written test question. sections lists the § numbers that answer it; an empty list means the act does
// not answer it, so the right response is a refusal.
export interface GoldenQuestion {
  question: string;
  sections: string[];
}

export interface RetrievalResult {
  expected: string[];
  // Section numbers in ranked order, per retrieval mode.
  ranked: Record<RetrievalMode, string[]>;
}

export interface AnswerResult {
  expected: string[];
  answer: Answer | null;
}

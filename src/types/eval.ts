import type { Answer } from './rag.ts';
import type { RetrievalMode } from './retrieval.ts';

export interface GoldenQuestion {
  question: string;
  sections: string[];
}

export interface RetrievalResult {
  actCode: string;
  expected: string[];

  ranked: Record<RetrievalMode, string[]>;
}

export interface AnswerResult {
  actCode: string | null;
  expected: string[];
  answer: Answer | null;
}

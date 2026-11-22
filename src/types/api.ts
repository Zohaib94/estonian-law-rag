import type { Answer } from './rag.ts';
import type { RetrievedSection } from './retrieval.ts';

export interface AskRequest {
  question: string;
}

// answer is null when no Gemini key is set, or when the model failed or could not ground its answer.
// sections are always returned, so the reader can check the answer against the law.
export interface AskResponse {
  answer: Answer | null;
  sections: RetrievedSection[];
}

export type Ask = (question: string) => Promise<AskResponse>;

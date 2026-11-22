import type { Answer } from './rag.ts';
import type { RetrievedSection } from './retrieval.ts';

export interface AskRequest {
  question: string;
}

export interface AskResponse {
  answer: Answer | null;
  sections: RetrievedSection[];
}

export type Ask = (question: string) => Promise<AskResponse>;

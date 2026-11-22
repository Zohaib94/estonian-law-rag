import type { RetrievedSection } from './retrieval.ts';

export type GenerateJson = (prompt: string, schema: object) => Promise<unknown>;

export interface Answer {
  answerable: boolean;
  text: string;
  citations: string[];
}

export type AnswerQuestion = (question: string, sections: RetrievedSection[]) => Promise<Answer | null>;

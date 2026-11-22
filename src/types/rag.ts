import type { RetrievedSection } from './retrieval.ts';

export type GenerateJson = (prompt: string, schema: object) => Promise<unknown>;

// A written answer. citations are section numbers, each one of the sections the model was given.
export interface Answer {
  answerable: boolean;
  text: string;
  citations: string[];
}

// null means no usable answer: the model failed, timed out, or answered without citing a given section.
export type AnswerQuestion = (question: string, sections: RetrievedSection[]) => Promise<Answer | null>;

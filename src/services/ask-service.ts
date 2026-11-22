import type { MikroORM } from '@mikro-orm/postgresql';

import type { Ask } from '../types/api.ts';
import type { AnswerQuestion } from '../types/rag.ts';
import { createAnswerer } from './answer-generator.ts';
import { createGeminiClient } from './gemini-client.ts';
import { retrieveSections } from './retriever.ts';

// The whole pipeline for one question: retrieve sections, then (optionally) generate an answer from them.
export function createAsk(orm: MikroORM, answerQuestion?: AnswerQuestion): Ask {
  return async (question) => {
    const sections = await retrieveSections(orm.em.fork(), question);
    const answer = answerQuestion ? await answerQuestion(question, sections) : null;

    return { answer, sections };
  };
}

// Without a key the app still retrieves sections, but writes no answer.
export function createAnswerQuestion(apiKey: string | undefined, model: string): AnswerQuestion | undefined {
  return apiKey ? createAnswerer(createGeminiClient(apiKey, model)) : undefined;
}

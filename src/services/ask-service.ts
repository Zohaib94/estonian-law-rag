import type { MikroORM } from '@mikro-orm/postgresql';

import type { Ask } from '../types/api.ts';
import type { AnswerQuestion } from '../types/rag.ts';
import { createAnswerer } from './generation/answer-generator.ts';
import { createGeminiClient } from './client/gemini-client.ts';
import { retrieveSections } from './retrieval/retriever.ts';

export function createAsk(orm: MikroORM, answerQuestion?: AnswerQuestion): Ask {
  return async (question) => {
    const sections = await retrieveSections(orm.em.fork(), question);
    const answer = answerQuestion ? await answerQuestion(question, sections) : null;

    return { answer, sections };
  };
}

export function createAnswerQuestion(apiKey: string | undefined, model: string): AnswerQuestion | undefined {
  return apiKey ? createAnswerer(createGeminiClient(apiKey, model)) : undefined;
}

export const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GEMINI_TIMEOUT_MS = 30_000;

export const ANSWER_INSTRUCTIONS = `You answer questions about the Estonian Employment Contracts Act, using only the sections given below.
- Write for someone without legal training, in plain English, in at most 120 words.
- In citations, list the number of every section you relied on, exactly as written after § (for example "97" or "10¹").
- If the sections do not answer the question, set answerable to false, leave citations empty, and say in one sentence that the sections found do not cover it.
- Never use knowledge from outside the given sections.`;

export const ANSWER_SCHEMA = {
  type: 'object',
  properties: {
    answerable: { type: 'boolean' },
    answer: { type: 'string' },
    citations: { type: 'array', items: { type: 'string' } },
  },
  required: ['answerable', 'answer', 'citations'],
};

export const NOTHING_RETRIEVED = 'No section of the act matched this question.';

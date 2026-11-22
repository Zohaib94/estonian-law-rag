export const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GEMINI_TIMEOUT_MS = 30_000;

export const ANSWER_INSTRUCTIONS = `You answer questions about Estonian law, using only the sections given below.
- Each section is labelled with its act code and number in brackets, for example [TLS § 97]. Section numbers repeat across acts, so always keep the act code.
- Write for someone without legal training, in plain English, in at most 120 words.
- In citations, list the label of every section you relied on, exactly as written in the brackets (for example "TLS § 97" or "PS § 12"), without the brackets.
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

export const NOTHING_RETRIEVED = 'No section of the acts matched this question.';

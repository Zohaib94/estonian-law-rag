import { MAX_QUESTION_CHARS, MIN_QUESTION_CHARS } from './limits.ts';

export const ASK_BODY_SCHEMA = {
  type: 'object',
  required: ['question'],
  additionalProperties: false,
  properties: {
    // pattern: at least one non-space character.
    question: { type: 'string', minLength: MIN_QUESTION_CHARS, maxLength: MAX_QUESTION_CHARS, pattern: '\\S' },
  },
} as const;

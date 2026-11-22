import { ANSWER_SCHEMA, NOTHING_RETRIEVED } from '../../constants/rag.ts';
import type { Answer, AnswerQuestion, GenerateJson } from '../../types/rag.ts';
import type { RetrievedSection } from '../../types/retrieval.ts';
import { buildAnswerPrompt } from '../augmentation/answer-prompt.ts';
import { normalizeCitation, sectionRef } from '../augmentation/section-ref.ts';

interface Reply {
  answerable: boolean;
  answer: string;
  citations: string[];
}

export function createAnswerer(generate: GenerateJson): AnswerQuestion {
  return async (question, sections) => {
    if (sections.length === 0) {
      return { answerable: false, text: NOTHING_RETRIEVED, citations: [] };
    }

    try {
      return readAnswer(await generate(buildAnswerPrompt(question, sections), ANSWER_SCHEMA), sections);
    } catch (error) {
      console.warn('Answer generation failed:', error instanceof Error ? error.message : error);

      return null;
    }
  };
}

function readAnswer(reply: unknown, sections: RetrievedSection[]): Answer | null {
  if (!isReply(reply)) {
    return null;
  }

  const shown = new Set(sections.map(sectionRef));
  const citations = [...new Set(reply.citations.map(normalizeCitation))].filter(
    (citation): citation is string => citation !== null && shown.has(citation),
  );

  if (reply.answerable && citations.length === 0) {
    return null;
  }

  return { answerable: reply.answerable, text: reply.answer, citations: reply.answerable ? citations : [] };
}

function isReply(reply: unknown): reply is Reply {
  const candidate = reply as Partial<Reply> | null;

  return (
    typeof candidate?.answerable === 'boolean' &&
    typeof candidate.answer === 'string' &&
    Array.isArray(candidate.citations) &&
    candidate.citations.every((citation) => typeof citation === 'string')
  );
}

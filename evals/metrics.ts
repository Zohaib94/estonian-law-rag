import type { AnswerResult, RetrievalResult } from '../src/types/eval.ts';
import type { RetrievalMode } from '../src/types/retrieval.ts';

// Share of questions with at least one expected section in the top k.
export function recallAtK(results: RetrievalResult[], mode: RetrievalMode, k: number): number {
  return share(results, (result) => result.ranked[mode].slice(0, k).some((sectionNr) => result.expected.includes(sectionNr)));
}

// Mean of 1 / (position of the first expected section): 1 when it is first, 0.5 when second, 0 when missing.
export function meanReciprocalRank(results: RetrievalResult[], mode: RetrievalMode): number {
  const reciprocalRanks = results.map((result) => {
    const position = result.ranked[mode].findIndex((sectionNr) => result.expected.includes(sectionNr));

    return position === -1 ? 0 : 1 / (position + 1);
  });

  return mean(reciprocalRanks);
}

// Answerable questions: the answer cites at least one of the expected sections.
export function citationAccuracy(results: AnswerResult[]): number {
  const answerable = results.filter((result) => result.expected.length > 0);

  return share(answerable, (result) => result.answer?.citations.some((sectionNr) => result.expected.includes(sectionNr)) ?? false);
}

// Questions the act does not answer: the model said so instead of answering.
export function refusalAccuracy(results: AnswerResult[]): number {
  const unanswerable = results.filter((result) => result.expected.length === 0);

  return share(unanswerable, (result) => result.answer?.answerable === false);
}

// Requests that produced no usable answer: errors, timeouts, malformed or ungrounded replies.
export function missingAnswerRate(results: AnswerResult[]): number {
  return share(results, (result) => result.answer === null);
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function share<T>(items: T[], test: (item: T) => boolean): number {
  return items.length === 0 ? 0 : items.filter(test).length / items.length;
}

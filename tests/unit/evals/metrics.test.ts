import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import {
  citationAccuracy,
  meanReciprocalRank,
  missingAnswerRate,
  recallAtK,
  refusalAccuracy,
} from '../../../evals/metrics.ts';
import type { AnswerResult, RetrievalResult } from '../../../src/types/eval.ts';

function retrieval(expected: string[], hybrid: string[]): RetrievalResult {
  return { actCode: 'TLS', expected, ranked: { keyword: [], vector: [], hybrid } };
}

function answered(expected: string[], citations: string[] | null, answerable = true): AnswerResult {
  return { actCode: expected.length > 0 ? 'TLS' : null, expected, answer: citations === null ? null : { answerable, text: '', citations } };
}

describe('retrieval metrics', () => {
  const results = [retrieval(['97'], ['97', '98']), retrieval(['55'], ['1', '2', '55']), retrieval(['10¹'], ['1', '2'])];

  it('recall@k counts questions with an expected section in the top k', () => {
    assert.equal(recallAtK(results, 'hybrid', 1), 1 / 3);
    assert.equal(recallAtK(results, 'hybrid', 3), 2 / 3);
  });

  it('MRR averages 1 / position of the first expected section, 0 when missing', () => {
    assert.equal(meanReciprocalRank(results, 'hybrid'), (1 + 1 / 3 + 0) / 3);
  });

  it('is 0 for a mode that found nothing', () => {
    assert.equal(recallAtK(results, 'keyword', 5), 0);
  });
});

describe('answer metrics', () => {
  const results = [
    answered(['97'], ['97']),
    answered(['55'], ['54']),
    answered(['88'], null),
    answered([], [], false),
    answered([], ['97'], true),
  ];

  it('citation accuracy counts answerable questions whose answer cites an expected section', () => {
    assert.equal(citationAccuracy(results), 1 / 3);
  });

  it('refusal accuracy counts unanswerable questions the model declined', () => {
    assert.equal(refusalAccuracy(results), 1 / 2);
  });

  it('missing answer rate counts null answers across all questions', () => {
    assert.equal(missingAnswerRate(results), 1 / 5);
  });
});

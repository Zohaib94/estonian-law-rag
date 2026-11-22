import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { rankSections } from '../../../../src/services/retrieval/ranking.ts';
import type { SearchRow } from '../../../../src/types/retrieval.ts';

function row(sectionNr: string, keywordRank: number | null, vectorRank: number | null): SearchRow {
  return { actCode: 'TLS', sectionNr, title: '', text: '', keywordRank, vectorRank };
}

const ROWS = [row('97', 2, 3), row('98', 1, null), row('55', null, 1), row('10¹', 5, 6)];

function order(mode: 'keyword' | 'vector' | 'hybrid', limit = 10): string[] {
  return rankSections(ROWS, mode, limit).map((section) => section.sectionNr);
}

describe('rankSections', () => {
  it('hybrid puts a section found by both searches above one that topped a single search', () => {
    assert.deepEqual(order('hybrid'), ['97', '10¹', '98', '55']);
  });

  it('keyword and vector modes rank by their own list and leave out what it missed', () => {
    assert.deepEqual(order('keyword'), ['98', '97', '10¹']);
    assert.deepEqual(order('vector'), ['55', '97', '10¹']);
  });

  it('returns at most the limit, with a score on each section', () => {
    const top = rankSections(ROWS, 'hybrid', 2);

    assert.equal(top.length, 2);
    assert.equal(top[0].score, 1 / 62 + 1 / 63);
  });
});

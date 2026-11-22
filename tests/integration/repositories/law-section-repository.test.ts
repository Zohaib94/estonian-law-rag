import assert from 'node:assert/strict';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { EMBEDDING_DIMENSIONS } from '../../../src/constants/embedding.ts';
import { replaceSections, saveEmbedding, searchSections } from '../../../src/repositories/law-section-repository.ts';
import type { LawSection } from '../../../src/types/law.ts';
import { startDatabase, stopDatabase } from '../../helpers/database.ts';
import type { TestDatabase } from '../../helpers/database.ts';

const SECTIONS: LawSection[] = [
  { actCode: 'TLS', sectionNr: '55', position: 0, title: 'Annual holiday', text: 'Annual holiday is 28 calendar days.' },
  { actCode: 'TLS', sectionNr: '97', position: 1, title: 'Terms for advance notice', text: 'The employer gives notice.' },
  { actCode: 'TLS', sectionNr: '1', position: 2, title: 'Definition', text: 'An employment contract.' },
];

function oneHot(index: number): number[] {
  return Array.from({ length: EMBEDDING_DIMENSIONS }, (_, position) => (position === index ? 1 : 0));
}

describe('searchSections', () => {
  let database: TestDatabase;

  beforeAll(async () => {
    database = await startDatabase();

    const em = database.orm.em.fork();

    await replaceSections(em, 'TLS', SECTIONS);
    await Promise.all(SECTIONS.map((section, index) => saveEmbedding(em, section, oneHot(index))));
  });

  afterAll(async () => stopDatabase(database));

  it('ranks keyword matches by how many question words they contain, ORing the words', async () => {
    const rows = await searchSections(database.orm.em.fork(), 'How many days of annual holiday do I get?', oneHot(1));
    const holiday = rows.find((row) => row.sectionNr === '55');

    assert.equal(holiday?.keywordRank, 1);
  });

  it('ranks vector matches by cosine distance and reports both ranks per section', async () => {
    const rows = await searchSections(database.orm.em.fork(), 'notice from the employer', oneHot(1));
    const notice = rows.find((row) => row.sectionNr === '97');

    assert.equal(notice?.vectorRank, 1);
    assert.equal(notice?.keywordRank, 1);
  });

  it('returns sections found by only one search with a null rank for the other', async () => {
    const rows = await searchSections(database.orm.em.fork(), 'zebra', oneHot(2));
    const definition = rows.find((row) => row.sectionNr === '1');

    assert.equal(definition?.vectorRank, 1);
    assert.equal(definition?.keywordRank, null);
  });
});

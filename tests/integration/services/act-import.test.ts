import assert from 'node:assert/strict';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

import { importAct } from '../../../src/services/act-import.ts';
import { findSectionsWithoutEmbedding } from '../../../src/repositories/law-section-repository.ts';
import type { Act } from '../../../src/types/law.ts';
import { clearDatabase, startDatabase, stopDatabase } from '../../helpers/database.ts';
import type { TestDatabase } from '../../helpers/database.ts';

const ACT: Act = { code: 'TLS', name: 'Employment Contracts Act', sourceUrl: '', pageUrl: '' };

const VERSION_1 = `
  <p>§ 1. Definition of employment contract</p><p>(1) First version.</p>
  <p>§ 2. Mandatory nature of provisions</p><p>(1) Removed in version 2.</p>
`;

const VERSION_2 = '<p>§ 1. Definition of employment contract</p><p>(1) Second version.</p>';

describe('importAct', () => {
  let database: TestDatabase;

  beforeAll(async () => {
    database = await startDatabase();
  });

  afterAll(async () => stopDatabase(database));

  beforeEach(async () => clearDatabase(database));

  it('stores the parsed sections without embeddings', async () => {
    const count = await importAct(database.orm.em.fork(), ACT, VERSION_1);
    const stored = await findSectionsWithoutEmbedding(database.orm.em.fork(), 10);

    assert.equal(count, 2);
    assert.deepEqual(
      stored.map((section) => [section.sectionNr, section.text]),
      [
        ['1', '(1) First version.'],
        ['2', '(1) Removed in version 2.'],
      ],
    );
  });

  it('replaces the previous import, dropping sections the new version lacks', async () => {
    await importAct(database.orm.em.fork(), ACT, VERSION_1);
    await importAct(database.orm.em.fork(), ACT, VERSION_2);

    const stored = await findSectionsWithoutEmbedding(database.orm.em.fork(), 10);

    assert.deepEqual(stored.map((section) => section.text), ['(1) Second version.']);
  });

  it('refuses a page with no sections or a repeated section number', async () => {
    await assert.rejects(importAct(database.orm.em.fork(), ACT, '<p>Not found</p>'), /No § sections/);
    await assert.rejects(importAct(database.orm.em.fork(), ACT, VERSION_1 + VERSION_2), /appears twice/);
  });
});

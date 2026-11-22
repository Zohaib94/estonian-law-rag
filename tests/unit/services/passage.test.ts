import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { toPassage } from '../../../src/services/passage.ts';

describe('toPassage', () => {
  it('starts with the act name, section number and title', () => {
    const passage = toPassage({ actCode: 'TLS', sectionNr: '97', title: 'Terms for advance notice', text: '(1) Text.' });

    assert.equal(passage, 'Employment Contracts Act § 97. Terms for advance notice\n(1) Text.');
  });

  it('has no stray space for a section without a title', () => {
    const passage = toPassage({ actCode: 'PS', sectionNr: '12', title: '', text: 'Everyone is equal.' });

    assert.equal(passage, 'Constitution of the Republic of Estonia § 12.\nEveryone is equal.');
  });
});

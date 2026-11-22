import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { normalizeCitation, sectionRef } from '../../../../src/services/augmentation/section-ref.ts';

describe('sectionRef', () => {
  it('names a section with its act code', () => {
    assert.equal(sectionRef({ actCode: 'PS', sectionNr: '12' }), 'PS § 12');
    assert.equal(sectionRef({ actCode: 'TLS', sectionNr: '10¹' }), 'TLS § 10¹');
  });
});

describe('normalizeCitation', () => {
  it('turns every spelling of a label into the canonical one', () => {
    for (const spelling of ['TLS § 97', 'tls § 97', 'TLS 97', 'TLS §97', '[TLS § 97]', ' TLS § 97 ']) {
      assert.equal(normalizeCitation(spelling), 'TLS § 97', spelling);
    }

    assert.equal(normalizeCitation('PS § 10¹'), 'PS § 10¹');
  });

  it('rejects a number without an act, which could be a section of any act', () => {
    assert.equal(normalizeCitation('97'), null);
    assert.equal(normalizeCitation('§ 97'), null);
    assert.equal(normalizeCitation('the Constitution'), null);
  });
});

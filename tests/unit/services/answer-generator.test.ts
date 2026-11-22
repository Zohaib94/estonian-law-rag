import assert from 'node:assert/strict';
import { describe, it, vi } from 'vitest';

import { NOTHING_RETRIEVED } from '../../../src/constants/rag.ts';
import { createAnswerer } from '../../../src/services/answer-generator.ts';
import type { GenerateJson } from '../../../src/types/rag.ts';
import type { RetrievedSection } from '../../../src/types/retrieval.ts';

function section(actCode: string, sectionNr: string, title: string, text: string): RetrievedSection {
  return { actCode, sectionNr, title, text, keywordRank: 1, vectorRank: 1, score: 1 };
}

// § 1 exists in both acts; the Constitution has no section titles.
const SECTIONS = [
  section('TLS', '97', 'Terms for advance notice of cancellation by employer', '(1) The employer gives 15 to 90 days notice.'),
  section('TLS', '10¹', 'Probationary period', '(1) The probationary period is up to four months.'),
  section('PS', '12', '', 'Everyone is equal before the law.'),
];

function answering(reply: unknown) {
  return vi.fn<GenerateJson>(async () => reply);
}

const failing: GenerateJson = async () => {
  throw new Error('timeout');
};

describe('createAnswerer', () => {
  it('sends the question and the numbered sections as the prompt', async () => {
    const generate = answering({ answerable: true, answer: 'Up to 90 days.', citations: ['TLS § 97'] });

    await createAnswerer(generate)('How much notice?', SECTIONS);

    const [prompt] = generate.mock.calls[0];

    assert.match(prompt, /\[TLS § 97\] Terms for advance notice of cancellation by employer\n\(1\) The employer gives/);
    assert.match(prompt, /\[TLS § 10¹\] Probationary period/);
    assert.match(prompt, /\[PS § 12\]\nEveryone is equal before the law\./);
    assert.match(prompt, /TLS = Employment Contracts Act; PS = Constitution of the Republic of Estonia/);
    assert.match(prompt, /Question: How much notice\?$/);
  });

  it('keeps citations of sections it was shown, in any spelling of the label', async () => {
    const citations = ['TLS § 97', '[TLS § 10¹]', 'tls 97', 'PS § 12'];
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations }))('q', SECTIONS);

    assert.deepEqual(answer, { answerable: true, text: 'A.', citations: ['TLS § 97', 'TLS § 10¹', 'PS § 12'] });
  });

  it('compares the act code too: the same number in another act, or no act, is not a shown section', async () => {
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations: ['PS § 97', '97', '§ 97', 'TLS § 12'] }))(
      'q',
      SECTIONS,
    );

    assert.equal(answer, null);
  });

  it('drops citations of sections it was not shown', async () => {
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations: ['TLS § 97', 'TLS § 200'] }))(
      'q',
      SECTIONS,
    );

    assert.deepEqual(answer?.citations, ['TLS § 97']);
  });

  it('rejects an answer whose citations are all invalid, since nothing grounds it', async () => {
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations: ['200'] }))('q', SECTIONS);

    assert.equal(answer, null);
  });

  it('passes a refusal through, without citations', async () => {
    const answer = await createAnswerer(answering({ answerable: false, answer: 'Not covered.', citations: ['TLS § 97'] }))(
      'q',
      SECTIONS,
    );

    assert.deepEqual(answer, { answerable: false, text: 'Not covered.', citations: [] });
  });

  it('returns null for a malformed reply or a failed request', async () => {
    assert.equal(await createAnswerer(answering({ answer: 'no flags' }))('q', SECTIONS), null);
    assert.equal(await createAnswerer(failing)('q', SECTIONS), null);
  });

  it('refuses without calling the model when nothing was retrieved', async () => {
    const generate = answering({});
    const answer = await createAnswerer(generate)('q', []);

    assert.deepEqual(answer, { answerable: false, text: NOTHING_RETRIEVED, citations: [] });
    assert.equal(generate.mock.calls.length, 0);
  });
});

import assert from 'node:assert/strict';
import { describe, it, vi } from 'vitest';

import { NOTHING_RETRIEVED } from '../../../src/constants/rag.ts';
import { createAnswerer } from '../../../src/services/answer-generator.ts';
import type { GenerateJson } from '../../../src/types/rag.ts';
import type { RetrievedSection } from '../../../src/types/retrieval.ts';

function section(sectionNr: string, title: string, text: string): RetrievedSection {
  return { actCode: 'TLS', sectionNr, title, text, keywordRank: 1, vectorRank: 1, score: 1 };
}

const SECTIONS = [
  section('97', 'Terms for advance notice of cancellation by employer', '(1) The employer gives 15 to 90 days notice.'),
  section('10¹', 'Probationary period', '(1) The probationary period is up to four months.'),
];

function answering(reply: unknown) {
  return vi.fn<GenerateJson>(async () => reply);
}

describe('createAnswerer', () => {
  it('sends the question and the numbered sections as the prompt', async () => {
    const generate = answering({ answerable: true, answer: 'Up to 90 days.', citations: ['97'] });

    await createAnswerer(generate)('How much notice?', SECTIONS);

    const [prompt] = generate.mock.calls[0];

    assert.match(prompt, /\[§ 97\] Terms for advance notice of cancellation by employer\n\(1\) The employer gives/);
    assert.match(prompt, /\[§ 10¹\] Probationary period/);
    assert.match(prompt, /Question: How much notice\?$/);
  });

  it('keeps citations of sections it was shown, accepting a leading §', async () => {
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations: ['§ 97', '10¹', '97'] }))(
      'q',
      SECTIONS,
    );

    assert.deepEqual(answer, { answerable: true, text: 'A.', citations: ['97', '10¹'] });
  });

  it('drops citations of sections it was not shown', async () => {
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations: ['97', '200'] }))(
      'q',
      SECTIONS,
    );

    assert.deepEqual(answer?.citations, ['97']);
  });

  it('rejects an answer whose citations are all invalid, since nothing grounds it', async () => {
    const answer = await createAnswerer(answering({ answerable: true, answer: 'A.', citations: ['200'] }))('q', SECTIONS);

    assert.equal(answer, null);
  });

  it('passes a refusal through, without citations', async () => {
    const answer = await createAnswerer(answering({ answerable: false, answer: 'Not covered.', citations: ['97'] }))(
      'q',
      SECTIONS,
    );

    assert.deepEqual(answer, { answerable: false, text: 'Not covered.', citations: [] });
  });

  it('returns null for a malformed reply or a failed request', async () => {
    const failing: GenerateJson = async () => {
      throw new Error('timeout');
    };

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

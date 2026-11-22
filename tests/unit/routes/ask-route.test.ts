import assert from 'node:assert/strict';
import { describe, it, vi } from 'vitest';

import { buildApp } from '../../../src/app.ts';
import { MAX_QUESTION_CHARS } from '../../../src/constants/limits.ts';
import type { Ask } from '../../../src/types/api.ts';

function buildTestApp() {
  const ask = vi.fn<Ask>(async () => ({ answer: null, sections: [] }));

  return { app: buildApp(ask), ask };
}

describe('POST /api/ask', () => {
  it('passes the trimmed question to the pipeline and returns its result', async () => {
    const { app, ask } = buildTestApp();
    const response = await app.inject({ method: 'POST', url: '/api/ask', payload: { question: '  How long is notice?  ' } });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { answer: null, sections: [] });
    assert.deepEqual(ask.mock.calls[0], ['How long is notice?']);
  });

  it('rejects a blank, missing or too long question without running the pipeline', async () => {
    const { app, ask } = buildTestApp();
    const payloads = [{ question: '     ' }, {}, { question: 'x'.repeat(MAX_QUESTION_CHARS + 1) }];

    for (const payload of payloads) {
      const response = await app.inject({ method: 'POST', url: '/api/ask', payload });

      assert.equal(response.statusCode, 400);
    }

    assert.equal(ask.mock.calls.length, 0);
  });
});

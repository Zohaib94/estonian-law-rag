import assert from 'node:assert/strict';
import { afterEach, describe, it, vi } from 'vitest';

import { createGeminiClient } from '../../../../src/services/client/gemini-client.ts';

afterEach(() => vi.unstubAllGlobals());

describe('createGeminiClient', () => {
  it('sends the key and schema, and parses the JSON text of the reply', async () => {
    const fetchMock = vi.fn(async () => Response.json({ candidates: [{ content: { parts: [{ text: '{"answerable":true}' }] } }] }));

    vi.stubGlobal('fetch', fetchMock);

    const result = await createGeminiClient('key-1', 'model-x')('prompt', { type: 'object' });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];

    assert.deepEqual(result, { answerable: true });
    assert.match(url, /models\/model-x:generateContent$/);
    assert.equal((init.headers as Record<string, string>)['x-goog-api-key'], 'key-1');
    assert.equal(JSON.parse(init.body as string).generationConfig.responseJsonSchema.type, 'object');
  });

  it('throws on a non-200 reply', async () => {
    vi.stubGlobal('fetch', async () => new Response('rate limited', { status: 429 }));

    await assert.rejects(createGeminiClient('k', 'm')('p', {}), /429/);
  });
});

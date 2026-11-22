import assert from 'node:assert/strict';
import { afterEach, describe, it, vi } from 'vitest';

import { fetchAnswer } from '../../../web/src/services/ask-api.ts';
import { COPY } from '../../../web/src/constants/copy.ts';

afterEach(() => vi.unstubAllGlobals());

describe('fetchAnswer', () => {
  it('posts the question and returns the response body', async () => {
    const fetchMock = vi.fn(async () => Response.json({ answer: null, sections: [] }));

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchAnswer('How long is notice?');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];

    assert.deepEqual(result, { answer: null, sections: [] });
    assert.equal(url, '/api/ask');
    assert.deepEqual(JSON.parse(init.body as string), { question: 'How long is notice?' });
  });

  it("throws the server's message, or a generic one when there is none", async () => {
    vi.stubGlobal('fetch', async () => Response.json({ message: 'body/question must match pattern' }, { status: 400 }));
    await assert.rejects(fetchAnswer('x'), /must match pattern/);

    vi.stubGlobal('fetch', async () => new Response('oops', { status: 500 }));
    await assert.rejects(fetchAnswer('x'), new Error(COPY.genericError));
  });
});

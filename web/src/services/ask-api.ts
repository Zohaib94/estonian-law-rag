import type { AskResponse } from '../../../src/types/api.ts';
import { ASK_ENDPOINT } from '../constants/api.ts';
import { COPY } from '../constants/copy.ts';

export async function fetchAnswer(question: string): Promise<AskResponse> {
  const response = await fetch(ASK_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);

  return typeof body?.message === 'string' ? body.message : COPY.genericError;
}

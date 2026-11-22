import { GEMINI_TIMEOUT_MS, GEMINI_URL } from '../../constants/rag.ts';
import type { GenerateJson } from '../../types/rag.ts';

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

export function createGeminiClient(apiKey: string, model: string): GenerateJson {
  return async (prompt, schema) => {
    const response = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json', responseJsonSchema: schema },
      }),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Gemini returned ${response.status}`);
    }

    const body = (await response.json()) as GeminiResponse;

    return JSON.parse(body.candidates[0].content.parts[0].text);
  };
}

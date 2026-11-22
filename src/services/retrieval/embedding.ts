import { env, pipeline } from '@huggingface/transformers';
import type { FeatureExtractionPipeline } from '@huggingface/transformers';

import { EMBEDDING_MODEL, PASSAGE_PREFIX, QUERY_PREFIX } from '../../constants/embedding.ts';
import { MODEL_CACHE_DIR } from '../../constants/env.ts';

// The library's overloaded pipeline() type is too complex for tsc; pin the one overload we use.
const createExtractor = pipeline as (task: 'feature-extraction', model: string) => Promise<FeatureExtractionPipeline>;

let extractor: Promise<FeatureExtractionPipeline> | null = null;

export async function embedQuery(question: string): Promise<number[]> {
  const [vector] = await embed([QUERY_PREFIX + question]);

  return vector;
}

export async function embedPassages(passages: string[]): Promise<number[][]> {
  return embed(passages.map((passage) => PASSAGE_PREFIX + passage));
}

async function embed(texts: string[]): Promise<number[][]> {
  const output = await (await loadExtractor())(texts, { pooling: 'mean', normalize: true });

  return output.tolist() as number[][];
}

function loadExtractor(): Promise<FeatureExtractionPipeline> {
  if (MODEL_CACHE_DIR) {
    env.cacheDir = MODEL_CACHE_DIR;
  }

  extractor ??= createExtractor('feature-extraction', EMBEDDING_MODEL);

  return extractor;
}

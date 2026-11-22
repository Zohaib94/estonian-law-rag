import type { RetrievalMode } from '../types/retrieval.ts';

export const RECALL_K = 5;

export const RETRIEVAL_MODES: RetrievalMode[] = ['keyword', 'vector', 'hybrid'];

export const PASS_BARS = {
  hybridRecall: 0.8,
  citationAccuracy: 0.8,
  refusalAccuracy: 0.8,
};

// Pause between Gemini calls so a full run stays inside the free tier's requests-per-minute limit.
export const GEMINI_GAP_MS = 4_000;

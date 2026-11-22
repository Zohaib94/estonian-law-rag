import { RRF_K } from '../../constants/retrieval.ts';
import type { RetrievalMode, RetrievedSection, SearchRow } from '../../types/retrieval.ts';

// Reciprocal rank fusion: a section earns 1 / (RRF_K + rank) from each list it appears in. A section found by
// both keyword and vector search outranks one found by only one of them, and only ranks are compared, so the two
// searches' incompatible scores never need to be mixed. Keyword-only and vector-only modes exist for the evals.
const SCORERS: Record<RetrievalMode, (row: SearchRow) => number> = {
  keyword: (row) => reciprocal(row.keywordRank),
  vector: (row) => reciprocal(row.vectorRank),
  hybrid: (row) => reciprocal(row.keywordRank) + reciprocal(row.vectorRank),
};

export function rankSections(rows: SearchRow[], mode: RetrievalMode, limit: number): RetrievedSection[] {
  return rows
    .map((row) => ({ ...row, score: SCORERS[mode](row) }))
    .filter((section) => section.score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit);
}

function reciprocal(rank: number | null): number {
  return rank === null ? 0 : 1 / (RRF_K + rank);
}

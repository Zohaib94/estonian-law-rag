export type RetrievalMode = 'keyword' | 'vector' | 'hybrid';

// A section found by keyword search, vector search or both. A rank is null when that search did not find it.
export interface SearchRow {
  actCode: string;
  sectionNr: string;
  title: string;
  text: string;
  keywordRank: number | null;
  vectorRank: number | null;
}

export interface RetrievedSection extends SearchRow {
  score: number;
}

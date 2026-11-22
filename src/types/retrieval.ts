export type RetrievalMode = 'keyword' | 'vector' | 'hybrid';

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

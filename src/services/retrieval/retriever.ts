import type { EntityManager } from '@mikro-orm/postgresql';

import { SECTIONS_RETRIEVED } from '../../constants/retrieval.ts';
import { searchSections } from '../../repositories/law-section-repository.ts';
import type { RetrievedSection, SearchRow } from '../../types/retrieval.ts';
import { embedQuery } from './embedding.ts';
import { rankSections } from './ranking.ts';

// The retrieval step: the best few sections for a question, by hybrid search.
export async function retrieveSections(em: EntityManager, question: string): Promise<RetrievedSection[]> {
  return rankSections(await findSearchRows(em, question), 'hybrid', SECTIONS_RETRIEVED);
}

// Keyword and vector hits with their ranks, before fusion. The evals rank these rows three ways.
export async function findSearchRows(em: EntityManager, question: string): Promise<SearchRow[]> {
  return searchSections(em, question, await embedQuery(question));
}

import type { EntityManager } from '@mikro-orm/postgresql';

import { CANDIDATES_PER_SEARCH } from '../constants/retrieval.ts';
import { LawSectionEntity } from '../models/law-section.ts';
import type { LawSection } from '../types/law.ts';
import type { SectionText } from '../types/repository.ts';
import type { SearchRow } from '../types/retrieval.ts';

const SEARCH_SQL = `
  with query as (
    select ?::vector as question_embedding,
           replace(plainto_tsquery('english', ?)::text, '&', '|')::tsquery as keywords
  ),
  keyword_hits as (
    select act_code, section_nr, (row_number() over (order by ts_rank(tsv, query.keywords) desc))::int as rank
    from law_section, query
    where tsv @@ query.keywords
    order by rank
    limit ?
  ),
  vector_hits as (
    select act_code, section_nr,
           (row_number() over (order by law_section.embedding <=> query.question_embedding))::int as rank
    from law_section, query
    where law_section.embedding is not null
    order by rank
    limit ?
  )
  select s.act_code as "actCode", s.section_nr as "sectionNr", s.title, s.text,
         keyword_hits.rank as "keywordRank", vector_hits.rank as "vectorRank"
  from law_section s
  left join keyword_hits using (act_code, section_nr)
  left join vector_hits using (act_code, section_nr)
  where keyword_hits.rank is not null or vector_hits.rank is not null
`;

export async function searchSections(em: EntityManager, question: string, vector: number[]): Promise<SearchRow[]> {
  return em
    .getConnection()
    .execute(SEARCH_SQL, [toVectorLiteral(vector), question, CANDIDATES_PER_SEARCH, CANDIDATES_PER_SEARCH]);
}

export async function replaceSections(em: EntityManager, actCode: string, sections: LawSection[]): Promise<void> {
  await em.transactional(async (tx) => {
    await tx.nativeDelete(LawSectionEntity, { actCode });
    await tx.insertMany(LawSectionEntity, sections);
  });
}

export async function findSectionsWithoutEmbedding(em: EntityManager, limit: number): Promise<SectionText[]> {
  return em.getConnection().execute(
    `select act_code as "actCode", section_nr as "sectionNr", title, text
     from law_section
     where embedding is null
     order by act_code, position
     limit ?`,
    [limit],
  );
}

export async function saveEmbedding(em: EntityManager, section: SectionText, vector: number[]): Promise<void> {
  await em
    .getConnection()
    .execute('update law_section set embedding = ?::vector where act_code = ? and section_nr = ?', [
      toVectorLiteral(vector),
      section.actCode,
      section.sectionNr,
    ]);
}

function toVectorLiteral(vector: number[]): string {
  return `[${vector.join(',')}]`;
}

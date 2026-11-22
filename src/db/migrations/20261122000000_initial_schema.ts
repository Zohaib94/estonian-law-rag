import type { Knex } from 'knex';

import { EMBEDDING_DIMENSIONS } from '../../constants/embedding.ts';

// Raw SQL where knex's builder has no pgvector or generated tsvector support.
// shortcut: no HNSW index; one act is ~200 rows, and a sequential vector scan takes well under a millisecond.
export async function up(knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists vector');

  await knex.raw(`
    create table law_section (
      act_code text not null,
      section_nr text not null,
      position integer not null,
      title text not null,
      text text not null,
      tsv tsvector generated always as (to_tsvector('english', title || ' ' || text)) stored,
      embedding vector(${EMBEDDING_DIMENSIONS}),
      primary key (act_code, section_nr)
    )
  `);

  await knex.raw('create index law_section_tsv_idx on law_section using gin (tsv)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('drop table if exists law_section');
}

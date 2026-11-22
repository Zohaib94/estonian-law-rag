import type { EntityManager } from '@mikro-orm/postgresql';

import { LawSectionEntity } from '../models/law-section.ts';
import type { LawSection } from '../types/law.ts';
import type { SectionText } from '../types/repository.ts';

// Deleting first means a re-import also removes sections the new version no longer has.
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

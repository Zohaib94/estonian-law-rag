import { EntitySchema } from '@mikro-orm/core';

import type { LawSection } from '../types/law.ts';

// tsv and embedding columns are read and written with raw SQL in the law section repository.
export const LawSectionEntity = new EntitySchema<LawSection>({
  name: 'LawSection',
  tableName: 'law_section',
  properties: {
    actCode: { type: 'text', primary: true },
    sectionNr: { type: 'text', primary: true },
    position: { type: 'integer' },
    title: { type: 'text' },
    text: { type: 'text' },
  },
});

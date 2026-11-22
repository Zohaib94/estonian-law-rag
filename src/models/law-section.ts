import { EntitySchema } from '@mikro-orm/core';

import type { LawSection } from '../types/law.ts';

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

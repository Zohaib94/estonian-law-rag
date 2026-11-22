import type { EntityManager } from '@mikro-orm/postgresql';

import { replaceSections } from '../../repositories/law-section-repository.ts';
import type { Act } from '../../types/law.ts';
import { parseAct } from './act-parser.ts';

// Replaces the act's stored sections with the ones parsed from its HTML. Returns how many were stored.
export async function importAct(em: EntityManager, act: Act, html: string): Promise<number> {
  const sections = parseAct(html, act.code);

  if (sections.length === 0) {
    throw new Error(`No § sections found for ${act.code}. Has the page format changed?`);
  }

  const duplicate = findDuplicate(sections.map((section) => section.sectionNr));

  if (duplicate) {
    throw new Error(`§ ${duplicate} appears twice in ${act.code}. Were superscript numbers such as § 10¹ parsed?`);
  }

  await replaceSections(em, act.code, sections);

  return sections.length;
}

function findDuplicate(values: string[]): string | undefined {
  return values.find((value, index) => values.indexOf(value) !== index);
}

import { ACTS } from '../../constants/acts.ts';
import type { SectionText } from '../../types/repository.ts';

export function toPassage(section: SectionText): string {
  const actName = ACTS[section.actCode]?.name ?? section.actCode;

  const title = section.title === '' ? '' : ` ${section.title}`;

  return `${actName} § ${section.sectionNr}.${title}\n${section.text}`;
}

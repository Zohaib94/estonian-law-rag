import { ACTS } from '../../constants/acts.ts';
import type { SectionText } from '../../types/repository.ts';

// The text that gets embedded. The header names the act and section, so a subsection such as
// "(2) ... this section" still carries what it is about.
export function toPassage(section: SectionText): string {
  const actName = ACTS[section.actCode]?.name ?? section.actCode;

  // Some sections, such as those of the Constitution, have no title.
  const title = section.title === '' ? '' : ` ${section.title}`;

  return `${actName} § ${section.sectionNr}.${title}\n${section.text}`;
}

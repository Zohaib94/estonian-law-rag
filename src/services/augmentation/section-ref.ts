import type { SectionText } from '../../types/repository.ts';

export function sectionRef(section: Pick<SectionText, 'actCode' | 'sectionNr'>): string {
  return `${section.actCode} § ${section.sectionNr}`;
}

export function normalizeCitation(citation: string): string | null {
  const match = citation.trim().match(/^\[?\s*([A-Za-z]+)\s*§?\s*([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+)\s*\]?$/);

  return match ? sectionRef({ actCode: match[1].toUpperCase(), sectionNr: match[2] }) : null;
}

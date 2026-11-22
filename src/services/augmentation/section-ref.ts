import type { SectionText } from '../../types/repository.ts';

// Section numbers repeat across acts (§ 1 exists in every act), so a section is always named with its act code:
// "TLS § 97", "PS § 12". The same text is used in prompt labels, citations and the golden questions.
export function sectionRef(section: Pick<SectionText, 'actCode' | 'sectionNr'>): string {
  return `${section.actCode} § ${section.sectionNr}`;
}

// Reads a citation back into the canonical form: "TLS § 97", "tls 97" and "[TLS § 97]" all mean "TLS § 97".
// A number without an act code, such as "97", is ambiguous across acts, so it is not a citation (null).
export function normalizeCitation(citation: string): string | null {
  const match = citation.trim().match(/^\[?\s*([A-Za-z]+)\s*§?\s*([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+)\s*\]?$/);

  return match ? sectionRef({ actCode: match[1].toUpperCase(), sectionNr: match[2] }) : null;
}

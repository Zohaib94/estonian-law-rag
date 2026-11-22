// "§ 97. Terms for advance notice of cancellation by employer" or "§ 10¹. Probationary period".
export const SECTION_HEADING = /^§ ?([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+)\. +(.+)$/;

// "Chapter 5", "Subchapter 2 Obligations of Employer", "Division 1 ...": structure, not section text.
export const STRUCTURE_HEADING = /^(Chapter|Subchapter|Division) \d+/;

// Chapter titles printed in capitals on their own line, e.g. "GENERAL PROVISIONS".
export const CAPITALS_LINE = /^[A-Z][A-Z ,'’-]+$/;

// "[RT I, 30.04.2022, 1 – entry into force 01.08.2022]": amendment history, noise for search.
export const AMENDMENT_NOTE = /\[RT [^\]]*\]/g;

// "(2¹) [Repealed – RT I, 22.03.2022, 2 – entry into force 01.04.2022]"
export const REPEALED_SUBSECTION = /^\([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+\) \[Repealed/;

// Tags that start a new line of text when the HTML is flattened.
export const BLOCK_TAG = /<\/?(p|div|br|h[1-6]|li|tr|table|section)\b[^>]*>/gi;

export const SCRIPT_OR_STYLE = /<(script|style)\b[\s\S]*?<\/\1>/gi;

// Riigi Teataja writes "§ 10¹" as "§ 10<sup>1</sup>"; flattening it naively would give "§ 101", a different section.
export const SUPERSCRIPT_TAG = /<sup\b[^>]*>\s*(\d+)\s*<\/sup>/gi;

export const ANY_TAG = /<[^>]+>/g;

export const HTML_ENTITY = /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi;

export const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

export const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  sect: '§',
};

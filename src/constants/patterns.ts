

export const STRUCTURE_BLOCK = /<div\b[^>]*data-type="(?:peatykk|jagu|jaotis)"[^>]*>[\s\S]*?<\/div>/gi;

export const HOVER_MENU = /<div class="hover-item-menu">[\s\S]*?<\/div>/gi;

export const AMENDMENT_TABLE = /<details\b[\s\S]*?<\/details>/gi;

export const SECTION_HEADING_TAG = /<strong>\s*§ ?([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+)\.\s*<\/strong>(?:\s*<strong>([^<]*)<\/strong>)?/gi;

export const HEADING_MARK = '\u0001';

export const AMENDMENT_NOTE = /\[RT [^\]]*\]/g;

export const REMOVED_NOTE = /^(?:§ \S+ – § \S+ )?\[(?:Repealed|Omitted)/;

export const REPEALED_SUBSECTION = /^\([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+\) \[(Repealed|Omitted)/;

export const FOOTNOTE = /^[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?![0-9⁰¹²³⁴⁵⁶⁷⁸⁹])/;

export const BLOCK_TAG = /<\/?(p|div|br|h[1-6]|li|tr|table|section)\b[^>]*>/gi;

export const SCRIPT_OR_STYLE = /<(script|style)\b[\s\S]*?<\/\1>/gi;

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

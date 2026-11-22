// Riigi Teataja marks every part of an act with a data-type attribute. Only the parts below are matched here;
// the rest of the page is flattened to text.

// Chapters, subchapters and divisions ("Chapter II", "GENERAL PROVISIONS"): structure, not section text.
export const STRUCTURE_BLOCK = /<div\b[^>]*data-type="(?:peatykk|jagu|jaotis)"[^>]*>[\s\S]*?<\/div>/gi;

// "history" and "link" buttons beside every part. Their icon names would otherwise end up in the text.
export const HOVER_MENU = /<div class="hover-item-menu">[\s\S]*?<\/div>/gi;

// The table of amending acts at the top of the page.
export const AMENDMENT_TABLE = /<details\b[\s\S]*?<\/details>/gi;

// A section heading: "<strong>§ 97.  </strong><strong>Title</strong>" in the Employment Contracts Act, and just
// "<strong>§ 12.</strong> Text of the section" in the Constitution, which has no titles. The number may contain
// superscripts, so this runs after SUPERSCRIPT_TAG has replaced them.
export const SECTION_HEADING_TAG = /<strong>\s*§ ?([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+)\.\s*<\/strong>(?:\s*<strong>([^<]*)<\/strong>)?/gi;

// Replaces the heading tag in the flattened text, so a heading is told apart from body text that happens to
// start with "§ 5.". A control character cannot occur in the page.
export const HEADING_MARK = '\u0001';

// "[RT I, 30.04.2022, 1 – entry into force 01.08.2022]": amendment history, noise for search. Notes can wrap
// over several lines, so this runs on the whole text.
export const AMENDMENT_NOTE = /\[RT [^\]]*\]/g;

// A repealed section keeps its heading and gets a "[Repealed – RT I, ...]" line instead of text. An omitted range
// of sections is one line, "§ 140. – § 189. [Omitted from this text.]".
export const REMOVED_NOTE = /^(?:§ \S+ – § \S+ )?\[(?:Repealed|Omitted)/;

// "(2¹) [Repealed – RT I, 22.03.2022, 2 – entry into force 01.04.2022]"
export const REPEALED_SUBSECTION = /^\([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+\) \[(Repealed|Omitted)/;

// Footnotes at the end of the page start with a superscript number: "¹Council Directive 94/33/EC ...".
export const FOOTNOTE = /^[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?![0-9⁰¹²³⁴⁵⁶⁷⁸⁹])/;

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

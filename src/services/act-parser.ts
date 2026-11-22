import {
  AMENDMENT_NOTE,
  ANY_TAG,
  BLOCK_TAG,
  CAPITALS_LINE,
  HTML_ENTITY,
  NAMED_ENTITIES,
  REPEALED_SUBSECTION,
  SCRIPT_OR_STYLE,
  SECTION_HEADING,
  STRUCTURE_HEADING,
  SUPERSCRIPT_DIGITS,
  SUPERSCRIPT_TAG,
} from '../constants/patterns.ts';
import type { LawSection } from '../types/law.ts';

// Splits an act's HTML into one record per §. Text before § 1 (title, amendment table) is dropped, and
// sections that are repealed or omitted from the translation are skipped.
export function parseAct(html: string, actCode: string): LawSection[] {
  const sections: LawSection[] = [];
  // null outside a section worth keeping: before § 1, or inside a repealed or omitted §.
  let current: LawSection | null = null;

  for (const line of toLines(html)) {
    const heading = line.match(SECTION_HEADING);

    if (heading) {
      const [, sectionNr, title] = heading;

      current = isRemoved(title) ? null : { actCode, sectionNr, position: sections.length, title, text: '' };

      if (current) {
        sections.push(current);
      }
    } else if (current && isBodyLine(line)) {
      current.text = current.text === '' ? line : `${current.text}\n${line}`;
    }
  }

  return sections;
}

function toLines(html: string): string[] {
  const text = html
    .replace(SCRIPT_OR_STYLE, '')
    .replace(SUPERSCRIPT_TAG, (_, digits: string) => toSuperscript(digits))
    .replace(BLOCK_TAG, '\n')
    .replace(ANY_TAG, '');

  return decodeEntities(text)
    .split('\n')
    .map((line) => line.replace(AMENDMENT_NOTE, '').replace(/\s+/g, ' ').trim())
    .filter((line) => line !== '');
}

// "[Repealed – RT I ...]" or "[Omitted from this text.]"
function isRemoved(title: string): boolean {
  return title.startsWith('[');
}

function isBodyLine(line: string): boolean {
  return !STRUCTURE_HEADING.test(line) && !CAPITALS_LINE.test(line) && !REPEALED_SUBSECTION.test(line);
}

function toSuperscript(digits: string): string {
  return [...digits].map((digit) => SUPERSCRIPT_DIGITS[Number(digit)]).join('');
}

function decodeEntities(text: string): string {
  return text.replace(HTML_ENTITY, (entity, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(parseInt(code.slice(2), 16));
    }

    if (code.startsWith('#')) {
      return String.fromCodePoint(Number(code.slice(1)));
    }

    return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
  });
}

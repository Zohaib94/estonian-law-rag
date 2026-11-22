import {
  AMENDMENT_NOTE,
  AMENDMENT_TABLE,
  ANY_TAG,
  BLOCK_TAG,
  FOOTNOTE,
  HEADING_MARK,
  HOVER_MENU,
  HTML_ENTITY,
  NAMED_ENTITIES,
  REMOVED_NOTE,
  REPEALED_SUBSECTION,
  SCRIPT_OR_STYLE,
  SECTION_HEADING_TAG,
  STRUCTURE_BLOCK,
  SUPERSCRIPT_DIGITS,
  SUPERSCRIPT_TAG,
} from '../../constants/patterns.ts';
import type { LawSection } from '../../types/law.ts';

export function parseAct(html: string, actCode: string): LawSection[] {
  const sections: LawSection[] = [];

  let current: LawSection | null = null;

  for (const line of toLines(html)) {
    if (line.startsWith(HEADING_MARK)) {
      const [sectionNr, title] = line.slice(HEADING_MARK.length).split(HEADING_MARK);

      current = title.startsWith('[') ? null : { actCode, sectionNr, position: sections.length, title, text: '' };

      if (current) {
        sections.push(current);
      }
    } else if (current && REMOVED_NOTE.test(line)) {
      if (current.text === '') {
        sections.pop();
      }

      current = null;
    } else if (current && isBodyLine(line)) {
      current.text = current.text === '' ? line : `${current.text}\n${line}`;
    }
  }

  return sections;
}

function toLines(html: string): string[] {
  const text = html
    .replace(SCRIPT_OR_STYLE, '')
    .replace(AMENDMENT_TABLE, '')
    .replace(HOVER_MENU, '')
    .replace(STRUCTURE_BLOCK, '')
    .replace(SUPERSCRIPT_TAG, (_, digits: string) => toSuperscript(digits))
    .replace(
      SECTION_HEADING_TAG,
      (_, sectionNr: string, title = '') => `\n${HEADING_MARK}${sectionNr}${HEADING_MARK}${title}\n`,
    )
    .replace(BLOCK_TAG, '\n')
    .replace(ANY_TAG, '');

  return decodeEntities(text)
    .replace(AMENDMENT_NOTE, '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line !== '');
}

function isBodyLine(line: string): boolean {
  return !REPEALED_SUBSECTION.test(line) && !FOOTNOTE.test(line);
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

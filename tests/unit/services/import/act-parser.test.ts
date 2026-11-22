import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'vitest';

import { parseAct } from '../../../../src/services/import/act-parser.ts';

// Excerpts of the real pages served by Riigi Teataja (public-api/api/v1/en/akt/<id>/blob-html), cut down to a
// few sections each. Keep them real: the parser was first written from a description of the format and was wrong.
function fixture(name: string): string {
  return readFileSync(new URL(`../../../fixtures/${name}`, import.meta.url), 'utf8');
}

describe('parseAct on the Employment Contracts Act', () => {
  const sections = parseAct(fixture('tls-excerpt.html'), 'TLS');

  it('returns one section per kept §, in order, ignoring the page header and amendment table', () => {
    assert.deepEqual(
      sections.map((section) => [section.position, section.sectionNr, section.title]),
      [
        [0, '1', 'Definition of employment contract'],
        [1, '2¹', 'Protection against unfavourable treatment'],
        [2, '136', 'Preservation of personnel files'],
        [3, '139¹⁰', 'Implementation of working conditions of pregnant employee and employee who has the right to maternity leave'],
        [4, '190', 'Entry into force of Act'],
      ],
    );
  });

  it('keeps subsections as lines, without the history and link button labels', () => {
    assert.equal(
      sections[0].text,
      '(1) On the basis of an employment contract a natural person (employee) does work for another person ' +
        '(employer) in subordination to the management and control of the employer. The employer pays to the ' +
        'employee remuneration for such work.\n' +
        '(2) If a person does work for another person which, under the circumstances, can be expected to be done ' +
        'only for remuneration, it is presumed to be an employment contract.',
    );
  });

  it('keeps § 2¹ apart from § 21, and § 139¹⁰ from § 1310', () => {
    assert.ok(sections.every((section) => !/^(21|1310)$/.test(section.sectionNr)));
  });

  it('skips repealed sections, whether the note is in the title or after it', () => {
    // § 43¹ ("[Repealed ...]" line after the title) and § 135 (the title itself) are in the excerpt.
    assert.equal(sections.find((section) => section.sectionNr === '43¹'), undefined);
    assert.equal(sections.find((section) => section.sectionNr === '135'), undefined);
  });

  it('keeps chapter headings, amendment notes, footnotes and omitted ranges out of the text', () => {
    const text = sections.map((section) => section.text).join('\n');

    assert.doesNotMatch(text, /Chapter|Subchapter|GENERAL PROVISIONS|Obligations of Employee/);
    assert.doesNotMatch(text, /\[RT|entry into force 0\d\.\d\d\.\d{4}\]/);
    assert.doesNotMatch(text, /Council Directive|Omitted from this text/);
    assert.ok(sections[3].text.endsWith('in force before 15 May 2024.'));
  });

  it('keeps a superscript inside text, and tags every section with the act code', () => {
    assert.ok(sections[4].text.endsWith('(6) Subsection 1¹ of § 60 of this Act is in force up to and including 31 March 2022.'));
    assert.ok(sections.every((section) => section.actCode === 'TLS'));
  });
});

describe('parseAct on the Constitution', () => {
  const sections = parseAct(fixture('ps-excerpt.html'), 'PS');

  it('finds every § although the sections have no titles', () => {
    assert.deepEqual(
      sections.map((section) => [section.sectionNr, section.title]),
      [
        ['1', ''],
        ['2', ''],
        ['4', ''],
        ['12', ''],
        ['20', ''],
      ],
    );
  });

  it('starts the text right after "§ 1." and keeps unnumbered paragraphs as lines', () => {
    assert.equal(
      sections[0].text,
      'Estonia is an independent and sovereign democratic republic wherein the supreme power of the state is ' +
        'vested in the people.\nThe independence and sovereignty of Estonia are timeless and inalienable.',
    );
  });

  it('keeps Roman-numeral chapter headings, the preamble and footnotes out of the text', () => {
    const text = sections.map((section) => `${section.title}\n${section.text}`).join('\n');

    assert.doesNotMatch(text, /Chapter|GENERAL PROVISIONS|FUNDAMENTAL RIGHTS/);
    assert.doesNotMatch(text, /unwavering faith/);
    assert.doesNotMatch(text, /Riigikogu = the parliament/);
  });

  it('keeps numbered points as lines', () => {
    assert.match(sections[4].text, /\n1\) to execute a judgment of conviction or detention ordered by a court;\n2\) /);
  });
});

describe('parseAct', () => {
  it('returns nothing for a page without §§', () => {
    assert.deepEqual(parseAct('<p>Page not found</p>', 'TLS'), []);
  });
});

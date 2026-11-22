import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseAct } from '../../../src/services/act-parser.ts';

// Shaped like Riigi Teataja's English translation HTML: title and amendment table first, then chapters and §§.
const HTML = `
<html><head><style>p { color: red }</style><script>var x = '§ 999. Not a section';</script></head>
<body>
  <h1>Employment Contracts Act<sup>1</sup></h1>
  <p>Passed 17.12.2008</p>
  <h2>Chapter 1</h2>
  <h2>GENERAL PROVISIONS</h2>
  <p><strong>§ 1.&nbsp; Definition of employment contract</strong></p>
  <p>(1) On the basis of an employment contract a natural person (employee) does work.</p>
  <p>(2) An employment contract is entered into in writing.<br>[RT I, 30.04.2022, 1 – entry into force 01.08.2022]</p>
  <p><strong>§ 10<sup>1</sup>.&nbsp; Probationary period</strong></p>
  <p>(1) The probationary period shall not exceed four months.</p>
  <p>(2<sup>1</sup>) [Repealed – RT I, 22.03.2022, 2 – entry into force 01.04.2022]</p>
  <p>Subchapter 2 Obligations of Employer</p>
  <p><strong>§ 11.&nbsp; [Repealed – RT I 2009, 5, 35]</strong></p>
  <p>(1) This repealed text must not leak into any section.</p>
  <p><strong>§ 101.&nbsp; Information and consultation of employees</strong></p>
  <p>(1) The employer informs the employees&rsquo; representatives.</p>
</body></html>
`;

describe('parseAct', () => {
  const sections = parseAct(HTML, 'TLS');

  it('returns one section per kept §, in order, ignoring text before § 1', () => {
    assert.deepEqual(
      sections.map((section) => [section.position, section.sectionNr, section.title]),
      [
        [0, '1', 'Definition of employment contract'],
        [1, '10¹', 'Probationary period'],
        [2, '101', 'Information and consultation of employees'],
      ],
    );
  });

  it('keeps subsections as lines and drops amendment notes', () => {
    assert.equal(
      sections[0].text,
      '(1) On the basis of an employment contract a natural person (employee) does work.\n' +
        '(2) An employment contract is entered into in writing.',
    );
  });

  it('drops repealed subsections and structure headings', () => {
    assert.equal(sections[1].text, '(1) The probationary period shall not exceed four months.');
  });

  it('decodes entities and tags every section with the act code', () => {
    assert.equal(sections[2].text, '(1) The employer informs the employees’ representatives.');
    assert.ok(sections.every((section) => section.actCode === 'TLS'));
  });

  it('returns nothing for a page without §§', () => {
    assert.deepEqual(parseAct('<p>Page not found</p>', 'TLS'), []);
  });
});

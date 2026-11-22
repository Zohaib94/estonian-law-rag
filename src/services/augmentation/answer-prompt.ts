import { ACTS } from '../../constants/acts.ts';
import { ANSWER_INSTRUCTIONS } from '../../constants/rag.ts';
import type { RetrievedSection } from '../../types/retrieval.ts';
import { sectionRef } from './section-ref.ts';

// The augment step: the retrieved sections, each labelled with its act code and number, become the only context
// the model may answer from. The labels are what the model cites.
export function buildAnswerPrompt(question: string, sections: RetrievedSection[]): string {
  const acts = `Acts: ${Object.values(ACTS)
    .map((act) => `${act.code} = ${act.name}`)
    .join('; ')}`;
  // Some sections, such as those of the Constitution, have no title.
  const sources = sections.map(
    (section) => `[${sectionRef(section)}]${section.title === '' ? '' : ` ${section.title}`}\n${section.text}`,
  );

  return [ANSWER_INSTRUCTIONS, acts, 'Sections:', ...sources, `Question: ${question}`].join('\n\n');
}

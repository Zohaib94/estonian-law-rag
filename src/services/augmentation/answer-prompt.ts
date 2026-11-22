import { ACTS } from '../../constants/acts.ts';
import { ANSWER_INSTRUCTIONS } from '../../constants/rag.ts';
import type { RetrievedSection } from '../../types/retrieval.ts';
import { sectionRef } from './section-ref.ts';

export function buildAnswerPrompt(question: string, sections: RetrievedSection[]): string {
  const acts = `Acts: ${Object.values(ACTS)
    .map((act) => `${act.code} = ${act.name}`)
    .join('; ')}`;

  const sources = sections.map(
    (section) => `[${sectionRef(section)}]${section.title === '' ? '' : ` ${section.title}`}\n${section.text}`,
  );

  return [ANSWER_INSTRUCTIONS, acts, 'Sections:', ...sources, `Question: ${question}`].join('\n\n');
}

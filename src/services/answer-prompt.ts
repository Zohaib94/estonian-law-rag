import { ANSWER_INSTRUCTIONS } from '../constants/rag.ts';
import type { RetrievedSection } from '../types/retrieval.ts';

// The augment step: the retrieved sections, each labelled with its number, become the only context the model
// may answer from. The labels are what the model cites.
export function buildAnswerPrompt(question: string, sections: RetrievedSection[]): string {
  const sources = sections.map((section) => `[§ ${section.sectionNr}] ${section.title}\n${section.text}`);

  return [ANSWER_INSTRUCTIONS, 'Sections:', ...sources, `Question: ${question}`].join('\n\n');
}

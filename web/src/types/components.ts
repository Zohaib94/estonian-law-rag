import type { Answer } from '../../../src/types/rag.ts';
import type { RetrievedSection } from '../../../src/types/retrieval.ts';

export interface QuestionFormProps {
  question: string;
  loading: boolean;
  error: string | null;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
}

export interface AnswerPanelProps {
  answer: Answer | null;
}

export interface SectionListProps {
  sections: RetrievedSection[];
  citations: string[];
}

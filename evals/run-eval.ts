import { readFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

import { GEMINI_API_KEY, GEMINI_MODEL } from '../src/constants/env.ts';
import { GEMINI_GAP_MS, PASS_BARS, RECALL_K, RETRIEVAL_MODES } from '../src/constants/eval.ts';
import { SECTIONS_RETRIEVED } from '../src/constants/retrieval.ts';
import { initOrm } from '../src/db/orm.ts';
import { createAnswerQuestion } from '../src/services/ask-service.ts';
import { rankSections } from '../src/services/ranking.ts';
import { findSearchRows } from '../src/services/retriever.ts';
import type { AnswerResult, GoldenQuestion, RetrievalResult } from '../src/types/eval.ts';
import type { RetrievalMode, SearchRow } from '../src/types/retrieval.ts';
import { citationAccuracy, meanReciprocalRank, missingAnswerRate, recallAtK, refusalAccuracy } from './metrics.ts';

const GOLDEN_FILE = new URL('./data/golden.jsonl', import.meta.url);

const orm = await initOrm();
const answerQuestion = createAnswerQuestion(GEMINI_API_KEY, GEMINI_MODEL);
const golden = await readGolden();

const retrievalResults: RetrievalResult[] = [];
const answerResults: AnswerResult[] = [];

// One question at a time, so Gemini's rate limit holds and progress reads in order.
for (const [index, entry] of golden.entries()) {
  const rows = await findSearchRows(orm.em.fork(), entry.question);

  // Unanswerable questions have no right section, so they only count towards the answer metrics.
  if (entry.sections.length > 0) {
    retrievalResults.push({ expected: entry.sections, ranked: rankEveryMode(rows) });
  }

  if (answerQuestion) {
    const answer = await answerQuestion(entry.question, rankSections(rows, 'hybrid', SECTIONS_RETRIEVED));

    answerResults.push({ expected: entry.sections, answer });
    console.log(`${index + 1}/${golden.length} answered`);
    await sleep(GEMINI_GAP_MS);
  }
}

console.log(`\nRetrieval, ${retrievalResults.length} answerable questions`);
console.table(
  Object.fromEntries(
    RETRIEVAL_MODES.map((mode) => [
      mode,
      { [`recall@${RECALL_K}`]: recallAtK(retrievalResults, mode, RECALL_K), mrr: meanReciprocalRank(retrievalResults, mode) },
    ]),
  ),
);

const checks = [recallAtK(retrievalResults, 'hybrid', RECALL_K) >= PASS_BARS.hybridRecall];

if (answerQuestion) {
  const answers = {
    'citation accuracy': citationAccuracy(answerResults),
    'refusal accuracy': refusalAccuracy(answerResults),
    'no usable answer': missingAnswerRate(answerResults),
  };

  console.log(`\nAnswers, ${answerResults.length} questions`);
  console.table(answers);
  checks.push(answers['citation accuracy'] >= PASS_BARS.citationAccuracy, answers['refusal accuracy'] >= PASS_BARS.refusalAccuracy);
} else {
  console.log('\nAnswers: skipped, set GEMINI_API_KEY to evaluate them.');
}

const passed = checks.every(Boolean);

console.log(passed ? 'PASS' : 'FAIL');

await orm.close();
process.exit(passed ? 0 : 1);

async function readGolden(): Promise<GoldenQuestion[]> {
  const text = await readFile(GOLDEN_FILE, 'utf8');

  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as GoldenQuestion);
}

// All rows, ranked each way, so recall@k and MRR can look as deep as they need.
function rankEveryMode(rows: SearchRow[]): Record<RetrievalMode, string[]> {
  const ranked = RETRIEVAL_MODES.map((mode) => [mode, rankSections(rows, mode, rows.length).map((row) => row.sectionNr)]);

  return Object.fromEntries(ranked) as Record<RetrievalMode, string[]>;
}

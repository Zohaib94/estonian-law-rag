# Evals

`npm run eval` runs every question in `data/golden.jsonl` through the pipeline and prints how well each step did.
It exits 1 if a pass bar is missed, so it can run in CI.

## The data

`data/golden.jsonl` has one hand-written question per line:

```json
{"question": "How much notice must an employer give before cancelling an employment contract?", "sections": ["TLS § 97"]}
{"question": "How many members does the Riigikogu have?", "sections": ["PS § 60"]}
{"question": "What is the speed limit on Estonian highways?", "sections": []}
```

- `sections` lists the sections that answer the question, each with its act code and the number as printed in the
  act (`"TLS § 10¹"`, not `"TLS § 101"`). Section numbers repeat across acts, so the act is part of the label: a
  right number in the wrong act is a miss. Several sections mean any of them is a correct find.
- An empty list means no act answers the question. The right response is a refusal.
- Two questions are in Estonian, to check that the multilingual embedding finds English text from them.
- The file has 55 questions: 29 on the Employment Contracts Act (`TLS`), 21 on the Constitution (`PS`) and 5 that
  neither answers. Some `PS` questions are also about work (free choice of occupation, search of a workplace,
  discrimination, help in old age) and one asks about discrimination at work, labelled with both `TLS § 3` and
  `PS § 12`. They test that the right act is found among both.
- A question counts towards the act of its first listed section in the per-act numbers.

The expected sections were chosen by reading the acts' text, not by running this app, so the labels aren't biased
towards what the retriever already finds. The `TLS` labels were rechecked against the version in force from
01.10.2026: all sections exist with the same titles, and the amended ones (minors, military service) still answer
the same questions.

## What it measures

**Retrieval** (always runs, no API key needed). Answerable questions only, ranked three ways from the same search,
first over all of them and then for each act:

| Metric | Meaning |
|---|---|
| `recall@5` | Share of questions with a correct section in the top 5, the sections the model sees. |
| `mrr` | Mean reciprocal rank: 1 if a correct section is first, 0.5 if second, 0 if missing. |

Comparing `keyword`, `vector` and `hybrid` shows what each search contributes.

**Answers** (only with `GEMINI_API_KEY` set). Every question, answered from the hybrid top 5:

| Metric | Meaning |
|---|---|
| `citation accuracy` | Answerable questions whose answer cites a correct section, with its act code. Also shown per act. |
| `refusal accuracy` | Unanswerable questions where the model said the acts don't cover it. |
| `no usable answer` | Errors, timeouts, and answers rejected for citing no section the model was shown. |

## Pass bars

Hybrid recall@5 ≥ 0.8. With a key, also citation accuracy ≥ 0.8 and refusal accuracy ≥ 0.8.

## How to use it

Change one thing at a time (the passage header, `CANDIDATES_PER_SEARCH`, `RRF_K`, the prompt) and rerun.
Keep a change only if the numbers improve. Before trusting a metric, read a few failing questions yourself:
a wrong expected section in the golden file looks exactly like a retrieval miss.

## Latest results (no Gemini key; answers not measured)

Run on the two acts as imported from Riigi Teataja, `TLS` in force from 01.10.2026:

| Questions | keyword recall@5 / MRR | vector | hybrid |
|---|---|---|---|
| All 50 answerable | 0.68 / 0.52 | 0.82 / 0.78 | 0.96 / 0.71 |
| `TLS`, 29 | 0.66 / 0.45 | 0.72 / 0.74 | 0.97 / 0.66 |
| `PS`, 21 | 0.71 / 0.62 | 0.95 / 0.83 | 0.95 / 0.79 |

The two hybrid misses: the Estonian question about annual holiday (`TLS § 55` ranked 9th), and "Who has the right to
vote in Riigikogu elections?" (`PS § 57` is not in the top 20). Both labels are right; both are retrieval misses.
Hybrid wins on recall but not on MRR: vector search ranks the right section higher when it finds it.

## Not measured yet

Whether the answer text is correct and faithful to the sections. That needs an LLM judge, checked against
your own labels on a sample of answers.

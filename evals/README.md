# Evals

`npm run eval` runs every question in `data/golden.jsonl` through the pipeline and prints how well each step did.
It exits 1 if a pass bar is missed, so it can run in CI.

## The data

`data/golden.jsonl` has one hand-written question per line:

```json
{"question": "How much notice must an employer give before cancelling an employment contract?", "sections": ["97"]}
{"question": "What is the speed limit on Estonian highways?", "sections": []}
```

- `sections` lists the § numbers that answer the question, as printed in the act (`"10¹"`, not `"101"`).
  Several numbers mean any of them is a correct find.
- An empty list means the act does not answer the question. The right response is a refusal.
- One question is in Estonian, to check that the multilingual embedding finds English text from it.

The expected sections were chosen by reading the act's table of contents, not by running this app, so the labels
aren't biased towards what the retriever already finds.

## What it measures

**Retrieval** (always runs, no API key needed). Answerable questions only, ranked three ways from the same search:

| Metric | Meaning |
|---|---|
| `recall@5` | Share of questions with a correct section in the top 5, the sections the model sees. |
| `mrr` | Mean reciprocal rank: 1 if a correct section is first, 0.5 if second, 0 if missing. |

Comparing `keyword`, `vector` and `hybrid` shows what each search contributes.

**Answers** (only with `GEMINI_API_KEY` set). Every question, answered from the hybrid top 5:

| Metric | Meaning |
|---|---|
| `citation accuracy` | Answerable questions whose answer cites a correct section. |
| `refusal accuracy` | Unanswerable questions where the model said the act doesn't cover it. |
| `no usable answer` | Errors, timeouts, and answers rejected for citing no section the model was shown. |

## Pass bars

Hybrid recall@5 ≥ 0.8. With a key, also citation accuracy ≥ 0.8 and refusal accuracy ≥ 0.8.

## How to use it

Change one thing at a time (the passage header, `CANDIDATES_PER_SEARCH`, `RRF_K`, the prompt) and rerun.
Keep a change only if the numbers improve. Before trusting a metric, read a few failing questions yourself:
a wrong expected section in the golden file looks exactly like a retrieval miss.

## Not measured yet

Whether the answer text is correct and faithful to the sections. That needs an LLM judge, checked against
your own labels on a sample of answers.

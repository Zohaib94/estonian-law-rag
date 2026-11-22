# Estonian employment law assistant

Ask a question about the Estonian Employment Contracts Act (Töölepingu seadus, TLS) and get a short answer that
cites the sections of the act it is based on. Every answer comes with the sections themselves, so you can check
it against the law.

It is a small retrieval-augmented generation (RAG) app, built to learn RAG and evals end to end. It gives legal
information, not legal advice. The text is the official English translation from
[Riigi Teataja](https://www.riigiteataja.ee); the Estonian original is the legally binding version.

## How it works

1. **Index (once).** The act's HTML is downloaded from Riigi Teataja, split into one record per section (§), and
   each section is stored in Postgres with a full-text index and an embedding (a list of 384 numbers that
   captures its meaning).
2. **Retrieve.** A question is searched two ways: by keywords and by embedding similarity. The two ranked lists
   are merged, and the top 5 sections are kept.
3. **Augment.** Those 5 sections, each labelled with its § number, are put into the prompt as the only context.
4. **Generate.** Gemini answers from that context and lists the § numbers it used. The app drops any citation of a
   section the model wasn't given, and rejects an answer left with none.

Without a Gemini key, steps 1–2 still work: you get the 5 most relevant sections, but no written answer.
See [Architecture](docs/architecture.md) for the details and the reasons behind each choice.

## Run with Docker

```bash
cp .env.example .env                        # optional: add GEMINI_API_KEY for written answers
docker compose up -d --build
docker compose exec api node src/scripts/import-act.ts
docker compose exec api node src/scripts/embed-sections.ts
```

Open http://localhost:3001. The first embed downloads the embedding model (about 120 MB) into a Docker volume.

Ports 3001 (app) and 5433 (Postgres) are used so this runs alongside the nutrition-label app.

## Run locally

Needs Node 22.18+ and Docker (for Postgres).

```bash
npm install
docker compose up -d db
cp .env.example .env    # then export the variables, or set them in your shell
npm run import:act      # downloads and stores the act; runs migrations first
npm run embed           # embeds every section without an embedding
npm run dev             # API on :3001
npm run web:dev         # UI on :5173, proxies /api to :3001
```

To import from a saved copy of the page instead of downloading it: `npm run import:act -- path/to/act.html`.
Re-importing replaces the act's sections, so run `npm run embed` again afterwards.

Try the API directly:

```bash
curl -s localhost:3001/api/ask -H 'content-type: application/json' \
  -d '{"question": "How much notice must an employer give before cancelling a contract?"}'
```

## Written answers with Gemini (optional)

1. Create a free key at https://aistudio.google.com/apikey.
2. Put it in `.env`: `GEMINI_API_KEY=your-key`.
3. Restart: `docker compose up -d`, or export it before `npm run dev`.

One question costs one Gemini request.

## Evals

```bash
npm run eval
```

Runs 33 hand-written questions through the pipeline. It always measures retrieval (is the right section in the
top 5?) for keyword, vector and hybrid search. With a Gemini key it also measures the answers: does the answer
cite the right section, and does the model refuse questions the act doesn't cover? See
[evals/README.md](evals/README.md).

## Checks

```bash
npm test                  # all tests (Vitest)
npm run test:unit         # no Docker needed
npm run test:integration  # needs Docker: import and search SQL against Postgres + pgvector (Testcontainers)
npm run lint              # oxlint
npm run typecheck         # tsc, no emit
```

## Database migrations

The schema is managed with [Knex](https://knexjs.org) migrations in `src/db/migrations`; entities and queries use
MikroORM. The server and `import:act` run pending migrations on start. To run them by hand:

```bash
npm run migrate            # apply pending migrations
npm run migrate:rollback   # undo the last batch
```

To add one, create `src/db/migrations/<timestamp>_<name>.ts` exporting `up` and `down`, then register it in
`src/db/migrate.ts`.

## Not in v1

- Only one act, and only one version of it (in force from 15.06.2024). Newer versions and other acts (for example
  the Law of Obligations Act for tenancy) need their URLs added to `src/constants/acts.ts`.
- The English translation only; the binding Estonian text isn't indexed.
- Long sections are embedded whole, so text past the model's 512-token limit doesn't affect their embedding.
- No reranking model, no query rewriting, no following of cross-references between sections.
- No LLM judge for answer correctness in the evals.
- No deployment, accounts or rate limiting.

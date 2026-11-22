# Estonian law assistant

Ask a question about the Estonian Employment Contracts Act (Töölepingu seadus, code `TLS`) or the Constitution of
the Republic of Estonia (Eesti Vabariigi põhiseadus, code `PS`) and get a short answer that cites the sections it
is based on, such as "TLS § 97" or "PS § 12". Every answer comes with the sections themselves, so you can check
it against the law.

It is a small retrieval-augmented generation (RAG) app, built to learn RAG and evals end to end. It gives legal
information, not legal advice. The text is the official English translation from
[Riigi Teataja](https://www.riigiteataja.ee); the Estonian original is the legally binding version.

## How it works

1. **Index (once).** Each act's HTML is downloaded from Riigi Teataja, split into one record per section (§), and
   each section is stored in Postgres with a full-text index and an embedding (a list of 384 numbers that
   captures its meaning). The acts are searched together; every section is tagged with its act code.
2. **Retrieve.** A question is searched two ways: by keywords and by embedding similarity. The two ranked lists
   are merged, and the top 5 sections are kept.
3. **Augment.** Those 5 sections, each labelled with its act code and § number (`[PS § 12]`), are put into the
   prompt as the only context.
4. **Generate.** Gemini answers from that context and lists the sections it used. The app drops any citation of a
   section the model wasn't given (the act code is compared too, since § 1 exists in every act), and rejects an
   answer left with none.

Without a Gemini key, steps 1–2 still work: you get the 5 most relevant sections, but no written answer.
See [Architecture](docs/architecture.md) for the details and the reasons behind each choice.

## Run with Docker

```bash
cp .env.example .env                        # optional: add GEMINI_API_KEY for written answers
docker compose up -d --build
docker compose exec api node src/scripts/import-act.ts        # every act; or pass a code: ... import-act.ts PS
docker compose exec api node src/scripts/embed-sections.ts
```

Open http://localhost:3001. The first embed downloads the embedding model (about 120 MB) into a Docker volume.

Ports 3001 (app) and 5433 (Postgres) are used so this runs alongside the nutrition-label app.

## Run locally

Needs Node 22.18+ (earlier 22.x cannot run the `.ts` scripts without `--experimental-strip-types`) and Docker (for
Postgres).

```bash
npm install
docker compose up -d db
cp .env.example .env    # then export the variables, or set them in your shell
npm run import:act      # downloads and stores every act; runs migrations first
npm run import:act -- PS   # or just one act, by code
npm run embed           # embeds every section without an embedding
npm run dev             # API on :3001
npm run web:dev         # UI on :5173, proxies /api to :3001
```

To import one act from a saved copy of its page instead of downloading it:
`npm run import:act -- PS path/to/constitution.html`. Re-importing replaces that act's sections (and only that
act's), so run `npm run embed` again afterwards.

### The acts

| Code | Act | Version |
|---|---|---|
| `TLS` | [Employment Contracts Act](https://www.riigiteataja.ee/en/eli/527102026004/consolide) | translation published 27.10.2026, in force 01.10.2026 until 31.12.2026 |
| `PS` | [Constitution of the Republic of Estonia](https://www.riigiteataja.ee/en/eli/523042025002/consolide) | translation published 23.04.2025, in force from 01.03.2026 |

Both are pinned to one version of the translation by the id in their URLs (`src/constants/acts.ts`). The
Employment Contracts Act version is in force only until 31.12.2026, so its URLs need updating when the next
translation appears.

### Updating an act or adding another

1. In `src/constants/acts.ts`, change the act's two URLs, or add an entry with a new code, a name and the two URLs.
   The id in the URL (for example `527102026004`) names one version of the English translation. Riigi Teataja's
   own page can't be read without a browser, but `https://www.riigiteataja.ee/public-api/api/v1/en/akt/<any id of
   the act>?leiaKehtiv=true`, requested with `Accept: application/json`, returns the id of the version in force
   now as `kehtivId`.
2. `npm run import:act -- <code>`, then `npm run embed`. Check the count and a few sections against the page: the
   parser (`src/services/import/act-parser.ts`) was written for these two acts' markup, and another act may need more
   (for example Roman-numeral chapters, untitled sections and unnumbered paragraphs already work).
3. Add golden questions for the act to `evals/data/golden.jsonl` and run `npm run eval`.

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

Runs 55 hand-written questions through the pipeline (29 on the Employment Contracts Act, 21 on the Constitution,
the rest answered by neither), and reports retrieval overall and for each act. It always measures retrieval (is the right section in the
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

- Two acts, one version of each. Other acts (for example the Law of Obligations Act for tenancy) and newer versions
  need their URLs added to `src/constants/acts.ts`, as described above. Old versions are not kept.
- The Constitution's sections have no titles and the chapter headings are dropped, so a section is embedded and
  searched on its text alone.
- The English translation only; the binding Estonian text isn't indexed.
- Long sections are embedded whole, so text past the model's 512-token limit doesn't affect their embedding.
- No reranking model, no query rewriting, no following of cross-references between sections.
- No LLM judge for answer correctness in the evals.
- No deployment, accounts or rate limiting.

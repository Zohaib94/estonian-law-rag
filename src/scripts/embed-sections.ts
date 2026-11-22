import { EMBEDDING_BATCH_SIZE } from '../constants/embedding.ts';
import { initOrm } from '../db/orm.ts';
import { findSectionsWithoutEmbedding, saveEmbedding } from '../repositories/law-section-repository.ts';
import { embedPassages } from '../services/retrieval/embedding.ts';
import { toPassage } from '../services/retrieval/passage.ts';

const orm = await initOrm();
const em = orm.em.fork();

let total = 0;
let batch = await findSectionsWithoutEmbedding(em, EMBEDDING_BATCH_SIZE);

while (batch.length > 0) {
  const vectors = await embedPassages(batch.map(toPassage));

  await Promise.all(batch.map((section, index) => saveEmbedding(em, section, vectors[index])));

  total += batch.length;
  console.log(`embedded ${total}`);

  batch = await findSectionsWithoutEmbedding(em, EMBEDDING_BATCH_SIZE);
}

await orm.close();

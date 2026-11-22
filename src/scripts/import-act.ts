import { readFile } from 'node:fs/promises';

import { EMPLOYMENT_CONTRACTS_ACT } from '../constants/acts.ts';
import { migrate } from '../db/migrate.ts';
import { initOrm } from '../db/orm.ts';
import { importAct } from '../services/act-import.ts';

const act = EMPLOYMENT_CONTRACTS_ACT;

// Optional argument: a saved copy of the page, to import without network access.
const source = process.argv[2] ?? act.sourceUrl;

await migrate();

const orm = await initOrm();
const count = await importAct(orm.em.fork(), act, await readSource(source));

console.log(`imported ${count} sections of the ${act.name} from ${source}`);
console.log('next: npm run embed');

await orm.close();

async function readSource(location: string): Promise<string> {
  if (!location.startsWith('http')) {
    return readFile(location, 'utf8');
  }

  const response = await fetch(location);

  if (!response.ok) {
    throw new Error(`${location} returned ${response.status}`);
  }

  return response.text();
}

import { readFile } from 'node:fs/promises';

import { ACTS } from '../constants/acts.ts';
import { migrate } from '../db/migrate.ts';
import { initOrm } from '../db/orm.ts';
import { importAct } from '../services/import/act-import.ts';
import type { Act } from '../types/law.ts';

// Usage: import-act.ts [act code | all] [saved copy of the page]
// No arguments imports every act. The saved copy is for importing one act without network access.
const [codeArg = 'all', savedCopy] = process.argv.slice(2);
const acts = pickActs(codeArg);

if (savedCopy && acts.length !== 1) {
  throw new Error('A saved copy of a page can only be imported for one act: pass its code first.');
}

await migrate();

const orm = await initOrm();

for (const act of acts) {
  const source = savedCopy ?? act.sourceUrl;
  const count = await importAct(orm.em.fork(), act, await readSource(source));

  console.log(`imported ${count} sections of the ${act.name} (${act.code}) from ${source}`);
}

console.log('next: npm run embed');

await orm.close();

function pickActs(code: string): Act[] {
  if (code.toLowerCase() === 'all') {
    return Object.values(ACTS);
  }

  const act = ACTS[code.toUpperCase()];

  if (!act) {
    throw new Error(`Unknown act "${code}". Known acts: ${Object.keys(ACTS).join(', ')}, or all.`);
  }

  return [act];
}

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

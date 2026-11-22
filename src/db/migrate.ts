import knex from 'knex';
import type { Knex } from 'knex';

import { DATABASE_URL } from '../constants/env.ts';
import * as initialSchema from './migrations/20261122000000_initial_schema.ts';

// Listed explicitly (not read from disk) so migrations load the same under Node, Vitest and Docker.
// Add new migration modules to this list, newest last.
const MIGRATIONS: Record<string, Knex.Migration> = {
  '20261122000000_initial_schema': initialSchema,
};

const migrationSource: Knex.MigrationSource<string> = {
  getMigrations: async () => Object.keys(MIGRATIONS),
  getMigrationName: (name) => name,
  getMigration: async (name) => MIGRATIONS[name],
};

export async function migrate(action: 'latest' | 'rollback' = 'latest', connection: string = DATABASE_URL): Promise<void> {
  const db = knex({ client: 'pg', connection, migrations: { migrationSource } });

  try {
    await (action === 'latest' ? db.migrate.latest() : db.migrate.rollback());
  } finally {
    await db.destroy();
  }
}

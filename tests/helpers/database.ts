import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { MikroORM } from '@mikro-orm/postgresql';

import { migrate } from '../../src/db/migrate.ts';
import { initOrm } from '../../src/db/orm.ts';

export interface TestDatabase {
  orm: MikroORM;
  container: StartedPostgreSqlContainer;
}

const IMAGE = 'pgvector/pgvector:pg16';

export async function startDatabase(): Promise<TestDatabase> {
  const container = await new PostgreSqlContainer(IMAGE).start();
  await migrate('latest', container.getConnectionUri());

  const orm = await initOrm(container.getConnectionUri());

  return { orm, container };
}

export async function stopDatabase(database: TestDatabase): Promise<void> {
  await database.orm.close();
  await database.container.stop();
}

export async function clearDatabase(database: TestDatabase): Promise<void> {
  await database.orm.em.getConnection().execute('truncate law_section');
}

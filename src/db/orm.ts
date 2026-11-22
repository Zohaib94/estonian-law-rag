import { MikroORM } from '@mikro-orm/postgresql';

import { DATABASE_URL } from '../constants/env.ts';
import { LawSectionEntity } from '../models/law-section.ts';

export async function initOrm(clientUrl: string = DATABASE_URL): Promise<MikroORM> {
  return MikroORM.init({
    clientUrl,
    entities: [LawSectionEntity],
    debug: false,
  });
}

import { migrate } from '../db/migrate.ts';

const action = process.argv[2] === 'rollback' ? 'rollback' : 'latest';

await migrate(action);

console.log(`migrate ${action}: done`);

import { buildApp } from './app.ts';
import { GEMINI_API_KEY, GEMINI_MODEL, PORT } from './constants/env.ts';
import { WEB_DIST_DIR } from './constants/paths.ts';
import { migrate } from './db/migrate.ts';
import { initOrm } from './db/orm.ts';
import { registerWebApp } from './routes/web-route.ts';
import { createAnswerQuestion, createAsk } from './services/ask-service.ts';

await migrate();

const orm = await initOrm();

const app = buildApp(createAsk(orm, createAnswerQuestion(GEMINI_API_KEY, GEMINI_MODEL)));

registerWebApp(app, WEB_DIST_DIR);

await app.listen({ port: PORT, host: '0.0.0.0' });

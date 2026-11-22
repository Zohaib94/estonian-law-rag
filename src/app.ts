import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

import { LOG_LEVEL } from './constants/env.ts';
import { registerAskRoute } from './routes/ask-route.ts';
import type { Ask } from './types/api.ts';

export function buildApp(ask: Ask): FastifyInstance {
  const app = Fastify({ logger: { level: LOG_LEVEL } });

  registerAskRoute(app, ask);

  return app;
}

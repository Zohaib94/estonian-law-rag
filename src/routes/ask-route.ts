import type { FastifyInstance } from 'fastify';

import { ASK_BODY_SCHEMA } from '../constants/request-schemas.ts';
import type { Ask, AskRequest } from '../types/api.ts';

export function registerAskRoute(app: FastifyInstance, ask: Ask): void {
  app.post<{ Body: AskRequest }>('/api/ask', { schema: { body: ASK_BODY_SCHEMA } }, async (request) =>
    ask(request.body.question.trim()),
  );
}

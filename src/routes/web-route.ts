import { existsSync } from 'node:fs';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export function registerWebApp(app: FastifyInstance, distDir: string): void {
  if (existsSync(distDir)) {
    app.register(fastifyStatic, { root: distDir });
  }
}

import { existsSync } from 'node:fs';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

// Serves the built frontend when it exists; in development Vite serves it instead.
export function registerWebApp(app: FastifyInstance, distDir: string): void {
  if (existsSync(distDir)) {
    app.register(fastifyStatic, { root: distDir });
  }
}

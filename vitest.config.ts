import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    env: { LOG_LEVEL: 'silent' },

    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    environment: 'node',
    globals: true,
    testTimeout: 10000,
    exclude: ['node_modules', 'dist'],
  },
});

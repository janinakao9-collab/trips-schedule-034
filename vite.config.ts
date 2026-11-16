import { defineConfig } from 'vitest/config';
export default defineConfig(({command}) => ({ base: command === 'build' ? '/trips-schedule-034/' : '/', test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'], restoreMocks: true } }));

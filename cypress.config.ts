import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'w9iet9',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 60000, // 기본 명령 타임아웃 (예: 60초)
    responseTimeout: 120000, // 응답 타임아웃 (예: 120초)
  },
});

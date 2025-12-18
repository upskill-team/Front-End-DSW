import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'di6an5',

  e2e: {    baseUrl: process.env.CYPRESS_BASE_URL || 'https://localhost:5173',    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});

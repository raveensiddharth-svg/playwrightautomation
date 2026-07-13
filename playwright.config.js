import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout : 30000,
  expect : {
    tmeout : 20000
  },
  reporter : 'html',
  use: {
    browserName : 'chromium',
    headless : false,
    trace : 'retain-on-failure',
    screenshot : 'on'
  }
});


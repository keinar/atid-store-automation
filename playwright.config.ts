import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      outputDir: 'allure-results',
    }]
  ],
  timeout: 60 * 1000,

  expect: {
    timeout: 10000
  },

  use: {
    baseURL: process.env.BASE_URL || 'https://atid.store',
    trace: 'on-first-retry',
    headless: !!process.env.CI,
    viewport: { width: 1920, height: 1080 },
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      testDir: './tests',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],
});

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    projects: [{
      // Storybook-Tests
      extends: true,
      plugins: [,
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    },
    // React/jsdom-Tests
    {
      test: {
        environment: "jsdom",
        globals: true,
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        exclude: ['**/__stories__/**/*', '**/__tests__/storybook/**/*'],
        setupFiles: ['src/setupTests.ts'],
      },
    },
    // Node/Netlify Function-Tests
    {
      test: {
        name: 'functions',
        environment: 'node',
        globals: true,
        include: ['netlify/functions/**/*.test.ts'],
        setupFiles: [],
      }
    }]
  }
});
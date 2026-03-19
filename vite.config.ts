import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/loader.ts'),
      name: 'ChatWidget',
      fileName: 'widget',
      formats: ['iife'], // Best for simple <script> tags
    },
  },
});
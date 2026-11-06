import { defineConfig } from 'vite';
import { aureliaVersion, runtimeFileName } from './playground-runtime/aurelia-version.ts';

// Builds the framework bundle that runs inside the playground preview.
// Uses Aurelia's development builds so errors have readable messages.
export default defineConfig({
  define: {
    __AURELIA_VERSION__: JSON.stringify(aureliaVersion),
  },
  resolve: {
    conditions: ['development', 'module', 'browser', 'import', 'default'],
  },
  build: {
    outDir: '../static/aurelia2',
    emptyOutDir: false,
    copyPublicDir: false,
    minify: true,
    lib: {
      entry: './playground-runtime/entry.ts',
      formats: ['iife'],
      name: '__aureliaPlaygroundRuntime',
      fileName: () => runtimeFileName,
    },
  },
});

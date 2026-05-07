import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: 'es2022',
  outDir: 'dist',
  banner: { js: '#!/usr/bin/env node' },
  external: [
    '@awesomeui/transpiler-svelte',
    '@awesomeui/transpiler-solid',
    '@awesomeui/transpiler-angularjs',
    '@awesomeui/transpiler-react-native',
  ],
});

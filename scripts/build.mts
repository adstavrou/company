import { build } from 'esbuild';

await build({
  entryPoints: ['apps/my-awesome-app/src/main.ts'],
  outfile: 'dist/my-awesome-app/main.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  target: ['node20'],
  external: ['dotenv'] // αν θες να μην το bundle-άρει
});

import { build } from 'esbuild';
import copy from 'esbuild-copy-static-files';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.resolve(__dirname, '../apps/demo-code-snippets/src/main.ts')],
  bundle: true,
  outdir: path.resolve(__dirname, '../dist'),
  format: 'esm',
  sourcemap: true,
  plugins: [
    copy({
      src: path.resolve(__dirname, '../apps/demo-code-snippets/src/assets'),
      dest: path.resolve(__dirname, '../dist/assets'),
    })
  ]
});
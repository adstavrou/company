import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: path.resolve(__dirname, 'src'),
    base: './',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      port: parseInt(env.PORT) || 4999,
      open: true,
    },
    assetsInclude: ['**/*.md'],
  };
});

declare module 'esbuild-copy-static-files' {
  import type { Plugin } from 'esbuild';

  interface Options {
    src: string;
    dest: string;
  }

  export default function copy(options: Options): Plugin;
}

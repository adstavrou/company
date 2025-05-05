import { Tree } from '@nx/devkit';

export function generateFile(tree: Tree, path: string, content: string) {
  tree.write(path, content.trim());
}

export function readFileIfExists(tree: Tree, path: string): string | null {
  return tree.exists(path) ? tree.read(path, 'utf-8') : null;
}

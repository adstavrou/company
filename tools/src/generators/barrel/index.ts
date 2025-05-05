import { Tree, formatFiles, getProjects } from '@nx/devkit';
import { BarrelGeneratorSchema } from './schema';

export default async function (tree: Tree, options: BarrelGeneratorSchema) {
  const projectConfig = getProjects(tree).get(options.project);
  if (!projectConfig) {
    throw new Error(`Project '${options.project}' not found`);
  }

  const srcRoot = projectConfig.sourceRoot;
  if (!srcRoot) {
    throw new Error(`Project '${options.project}' has no sourceRoot defined`);
  }
  const files = tree
    .children(srcRoot)
    .filter(
      (f) => f !== 'index.ts' && f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.startsWith('_'),
    );

  const exports = files
    .map((f) => f.replace(/\.ts$/, ''))
    .map((base) => `export * from './${base}';`)
    .join('\n');

  tree.write(`${srcRoot}/index.ts`, `${exports}\n`);

  await formatFiles(tree);
}

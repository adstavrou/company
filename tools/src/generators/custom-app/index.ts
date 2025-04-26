import { Tree, formatFiles } from '@nx/devkit';
import type { CustomAppGeneratorSchema } from './schema';

function sanitizeAppName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

function validateAppName(name: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    throw new Error('Invalid app name. Only letters (a-z, A-Z), numbers (0-9), and hyphens (-) are allowed.');
  }
}

export default async function (tree: Tree, options: CustomAppGeneratorSchema) {
    console.log('Raw options.name:', options.name);

  if (!options.name || options.name.trim() === '') {
    throw new Error('You must provide a non-empty name for the app.');
  }

  validateAppName(options.name);

  const appName = sanitizeAppName(options.name);
  const appRoot = `apps/${appName}`;

  tree.write(
    `${appRoot}/src/main.ts`,
    `// Auto-generated\nconsole.log('Hello from ${appName} 🚀');`
  );

  tree.write(
    `${appRoot}/README.md`,
    `# ${appName}\n\nGenerated app`
  );

  tree.write(
    `${appRoot}/tsconfig.app.json`,
    JSON.stringify(
      {
        extends: '../../tsconfig.base.json',
        compilerOptions: {
          outDir: `../../dist/${appRoot}`,
        },
        include: ['src'],
      },
      null,
      2
    )
  );

  await formatFiles(tree);
}

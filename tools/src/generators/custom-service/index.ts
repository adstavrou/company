import { Tree, formatFiles } from '@nx/devkit';
import { prompt } from 'enquirer';
import { CustomServiceGeneratorSchema } from './schema';

export default async function (tree: Tree, options: CustomServiceGeneratorSchema) {
  if (!options.name) {
    let response = await prompt<{ serviceName: string }>([
      {
        type: 'input',
        name: 'serviceName',
        message: '🐸 What is the name of your service?',
        validate: (value) => (value.trim() ? true : '👉 You must provide a service name!'),
      },
    ]);
    options.name = response.serviceName;
  }

  if (!options.directory) {
    let response = await prompt<{ targetDir: string }>([
      {
        type: 'input',
        name: 'targetDir',
        message: '📦 Which library folder under libs/ ? (example: shared or core-utils)',
        validate: (value) => (value.trim() ? true : '👉 You must provide a target directory!'),
      },
    ]);
    options.directory = response.targetDir;
  }

  let serviceName = sanitizeFileName(options.name);
  let className = capitalizeServiceName(options.name);

  console.log(`👉 Final service file will be: ${serviceName}.service.ts`);
  console.log(`👉 Final class name will be: ${className}Service`);

  let targetPath = `libs/${options.directory}/src/${serviceName}.service.ts`;

  tree.write(
    targetPath,
    `export class ${className}Service {
  constructor() {
    console.log('${className}Service created!');
  }
}
`,
  );

  await formatFiles(tree);
}

function sanitizeFileName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function capitalizeServiceName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ') // replace non-alphanumerics with space
    .split(' ') // split into words
    .filter(Boolean) // remove empty parts
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

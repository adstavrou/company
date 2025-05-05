import { Tree, formatFiles } from '@nx/devkit';
import { prompt } from 'company-generators/prompt';
import * as fs from 'fs';
import { CustomAppGeneratorSchema } from './schema';

function sanitizeAppName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getUsedPorts(): Set<number> {
  let used = new Set<number>();
  if (!fs.existsSync('apps')) return used;

  for (let app of fs.readdirSync('apps')) {
    let envPath = `apps/${app}/.env`;
    if (fs.existsSync(envPath)) {
      let match = fs.readFileSync(envPath, 'utf8').match(/PORT=(\d+)/);
      if (match) used.add(Number(match[1]));
    }
  }
  return used;
}

function findNextFreePort(used: Set<number>, base = 4444): string {
  while (used.has(base)) base++;
  return base.toString();
}

function writeFile(tree: Tree, path: string, content: string) {
  tree.write(path, content.trimStart());
}

export default async function (tree: Tree, options: CustomAppGeneratorSchema) {
  if (!options.name) {
    const res = await prompt<{ appName: string }>([
      {
        type: 'input',
        name: 'appName',
        message: '🐸 Name of your app?',
        validate: (value: string) => value.trim() !== '' || '👉 Required!',
      },
    ]);
    options.name = res.appName;
  }

  let appName = sanitizeAppName(options.name);
  let appRoot = `apps/${appName}`;

  let portAnswer = await prompt<{ port: string }>([
    {
      type: 'input',
      name: 'port',
      message: '🐸 Port? (leave blank for auto)',
    },
  ]);
  let port = portAnswer.port.trim();
  let used = getUsedPorts();
  if (!port || used.has(Number(port))) port = findNextFreePort(used);

  writeFile(tree, `${appRoot}/.env`, `PORT=${port}`);
  writeFile(tree, `${appRoot}/README.md`, `# ${appName}\n\n> PORT=${port}`);
  writeFile(tree, `${appRoot}/app/index.ts`, '// Entry point');
  writeFile(tree, `${appRoot}/app/styles.css`, '');
  writeFile(tree, `${appRoot}/app/assets/.gitkeep`, '');
  writeFile(
    tree,
    `${appRoot}/tsconfig.json`,
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Node',
          strict: true,
          esModuleInterop: true,
          types: ['jest'],
        },
        include: ['app/**/*'],
      },
      null,
      2,
    ),
  );
  writeFile(
    tree,
    `${appRoot}/project.json`,
    JSON.stringify(
      {
        name: appName,
        $schema: '../../node_modules/nx/schemas/project-schema.json',
        sourceRoot: `${appRoot}/app`,
        projectType: 'application',
        targets: {
          build: {
            executor: 'nx:run-commands',
            options: {
              command: 'echo Build',
              cwd: appRoot,
            },
          },
        },
        tags: [],
      },
      null,
      2,
    ),
  );

  await formatFiles(tree);
}

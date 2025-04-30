import { Tree, formatFiles } from '@nx/devkit';
import { CustomAppGeneratorSchema } from './schema';
import { prompt } from 'enquirer';
import * as fs from 'fs';

function getUsedPorts(): Set<number> {
  let usedPorts = new Set<number>();
  let appsDirectory = 'apps';

  if (fs.existsSync(appsDirectory)) {
    let appDirectories = fs.readdirSync(appsDirectory);
    for (let appDir of appDirectories) {
      let envFilePath = `${appsDirectory}/${appDir}/.env`;
      if (fs.existsSync(envFilePath)) {
        let fileContent = fs.readFileSync(envFilePath, 'utf-8');
        let portMatch = fileContent.match(/PORT=(\d+)/);
        if (portMatch) {
          usedPorts.add(Number(portMatch[1]));
        }
      }
    }
  }

  return usedPorts;
}

function findNextFreePort(usedPorts: Set<number>): string {
  let basePort = 4444;
  let port = basePort;
  while (usedPorts.has(port)) {
    port++;
  }
  return port.toString();
}

function sanitizeAppName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // only lowercase letters, numbers, dashes
    .replace(/--+/g, '-') // no double dashes
    .replace(/^-+|-+$/g, ''); // no starting/ending dashes
}

// Create README.md
function generateReadMe(appRoot: string, appName: string, port: string, tree: Tree) {
  let content = `# ${appName}\n\nThis app was generated using \`company-generators:custom-app\`.\n\n> Default PORT: ${port}`;

  tree.write(`${appRoot}/README.md`, content);
}

// Create .env
function generateEnv(appRoot: string, port: string, tree: Tree) {
  let content = `PORT=${port}\n`;

  tree.write(`${appRoot}/.env`, content);
}

//Create index.html
function generateHtml(appRoot: string, appName: string, tree: Tree) {
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${appName}</title>
  <link rel="stylesheet" href="./app/styles.css" />
</head>
<body>
  <h1>🎲 Dice App</h1>
  <button id="rollBtn">Roll Dice</button>
  <div id="result"></div>

  <script type="module" src="./app/index.js"></script>
</body>
</html>
  `;

  tree.write(`${appRoot}/index.html`, content);
}

// Create app/index.ts
function generateIndexTs(appRoot: string, tree: Tree) {
  let content = `
    import { rollDice } from './logic/core';
    
    let button = document.getElementById('rollBtn')!;
    let result = document.getElementById('result')!;
    
    button.addEventListener('click', () => {
      let roll = rollDice();
      result.textContent = \`🎯 You rolled: \${roll}\`;
    });
    `;
  tree.write(`${appRoot}/app/index.ts`, content.trim());
}

// Create src/main.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateMainTs(appRoot: string, port: string, tree: Tree) {
  let content = `import dotenv from 'dotenv';\n\ndotenv.config();\n\nconst port = process.env.PORT || ${port};\nconsole.log(\`🚀 Hello from app running on port \${port}\`);`;

  tree.write(`${appRoot}/src/main.ts`, content.trim());
}

// Create LogicCore
function generateLogicCore(appRoot: string, tree: Tree) {
  let content = `
    export function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
  `;
  tree.write(`${appRoot}/app/logic/core.ts`, content.trim());
}

// Create app/styles.css
function generateStyles(appRoot: string, tree: Tree) {
  let content = `
  body {
    font-family: sans-serif;
    text-align: center;
    margin-top: 3rem;
  }
  
  button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
  }
  `;

  tree.write(`${appRoot}/app/styles.css`, content.trim());
}

// Create app/logic/core.spec.ts
function generateTests(appRoot: string, tree: Tree) {
  let content = `
  import { rollDice } from './core';
  
  describe('rollDice', () => {
    it('should return a number between 1 and 6', () => {
      let roll = rollDice();
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    });
  });
  `;

  tree.write(`${appRoot}/app/logic/core.spec.ts`, content.trim());
}

// Create app/assets/ folder
function generateAssetsFolder(appRoot: string, tree: Tree) {
  tree.write(`${appRoot}/app/assets/.gitkeep`, '');
}

// Creat package.json
function generatePackageJson(appRoot: string, appName: string, tree: Tree) {
  let content = JSON.stringify(
    {
      name: appName,
      type: 'module',
      scripts: {
        build: 'esbuild app/index.ts --bundle --outfile=app/index.js --sourcemap',
        serve: 'live-server --open=./index.html',
        test: 'jest',
      },
      devDependencies: {
        esbuild: '^0.19.0',
        'live-server': '^1.2.2',
        jest: '^29.0.0',
        'ts-jest': '^29.0.0',
        '@types/jest': '^29.0.0',
      },
    },
    null,
    2,
  );

  tree.write(`${appRoot}/package.json`, content);
}

// Create project.json
function generateProjectJson(appRoot: string, appName: string, tree: Tree) {
  let content = JSON.stringify(
    {
      name: appName,
      $schema: '../../node_modules/nx/schemas/project-schema.json',
      sourceRoot: `${appRoot}/app`,
      projectType: 'application',
      targets: {
        build: {
          executor: 'nx:run-commands',
          options: {
            command: 'pnpm run build',
            cwd: appRoot,
          },
        },
        start: {
          executor: 'nx:run-commands',
          options: {
            command: 'pnpm run serve',
            cwd: appRoot,
          },
        },
        test: {
          executor: 'nx:run-commands',
          options: {
            command: 'pnpm test',
            cwd: appRoot,
          },
        },
      },
      tags: [],
    },
    null,
    2,
  );

  tree.write(`${appRoot}/project.json`, content);
}

//Generate jest.config.ts
function generateJestConfig(appRoot: string, tree: Tree) {
  let content = `
import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.ts'],
};

export default config;
`;
  tree.write(`${appRoot}/jest.config.ts`, content.trim());
}

// Generate tsconfig.json
function generateTsConfig(appRoot: string, tree: Tree) {
  let content = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'Node',
        esModuleInterop: true,
        allowJs: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
        types: ['jest'],
      },
      include: ['app/**/*', 'jest.config.ts'],
    },
    null,
    2,
  );

  tree.write(`${appRoot}/tsconfig.json`, content);
}

// Create jest.config.ts
function generateJestConfigWithPreset(appRoot: string, appName: string, tree: Tree) {
  let content = `
import type { Config } from 'jest';

const config: Config = {
  displayName: '${appName}',
  preset: '../../jest.preset.js',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\\\.(ts|js|mjs)$': ['ts-jest', { useESM: true }],
  },
};

export default config;
  `.trim();

  tree.write(`${appRoot}/jest.config.ts`, content);
}

export default async function (tree: Tree, options: CustomAppGeneratorSchema) {
  if (!options.name || options.name.trim() === '') {
    let response = await prompt<{ appName: string }>([
      {
        type: 'input',
        name: 'appName',
        message: '🐸 How should we name your app?',
        validate: (value) => {
          if (!value || value.trim() === '') {
            return '👉 You must provide a name!';
          }
          return true;
        },
      },
    ]);
    options.name = response.appName;
  }

  console.log('✅ Final options.name:', options.name);

  let appName: string = sanitizeAppName(options.name);
  let appRoot = `apps/${appName}`;

  // Ask for PORT
  let portResponse = await prompt<{ port: string }>([
    {
      type: 'input',
      name: 'port',
      message: '🐸 What PORT should the app use? (leave empty for auto)',
    },
  ]);

  let port = portResponse.port.trim();

  // Gather all used ports from existing apps
  let usedPorts = getUsedPorts();

  if (!port) {
    port = findNextFreePort(usedPorts);
  } else {
    let manualPort = Number(port);
    if (usedPorts.has(manualPort)) {
      let { usePortAnyway } = await prompt<{ usePortAnyway: boolean }>([
        {
          type: 'confirm',
          name: 'usePortAnyway',
          message: `⚠️ Port ${manualPort} is already in use. Use it anyway?`,
          initial: false,
        },
      ]);
      if (!usePortAnyway) {
        port = findNextFreePort(usedPorts);
        console.log(`👉 Switching to next free port: ${port}`);
      }
    }
  }

  console.log(`🚀 Final PORT for app: ${port}`);

  generateEnv(appRoot, port, tree);
  generateReadMe(appRoot, appName, port, tree);
  generateHtml(appRoot, appName, tree);
  generateIndexTs(appRoot, tree);
  //generateMainTs(appRoot, port, tree);
  generateLogicCore(appRoot, tree);
  generateStyles(appRoot, tree);
  generateTests(appRoot, tree);
  generateAssetsFolder(appRoot, tree);
  generatePackageJson(appRoot, appName, tree);
  generateProjectJson(appRoot, appName, tree);
  generateJestConfig(appRoot, tree);
  generateTsConfig(appRoot, tree);
  generateJestConfigWithPreset(appRoot, appName, tree);

  console.log(`\n🤟 Successfully created app: ${appRoot} (PORT: ${port})\n`);

  await formatFiles(tree);
}

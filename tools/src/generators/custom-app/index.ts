import { Tree, formatFiles } from '@nx/devkit';
import { CustomAppGeneratorSchema } from './schema';
import { prompt } from 'enquirer';
import * as fs from 'fs';

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

  let appName = sanitizeAppName(options.name);
  let appRoot = `apps/${appName}`;

  // Ask for PORT
  let portResponse = await prompt<{ port: string }>([
    {
      type: 'input',
      name: 'port',
      message: '🐸 What PORT should the app use? (leave empty for auto)',
    },
  ]);

  let portInput = portResponse.port.trim();

  // Gather all used ports from existing apps
  let usedPorts = new Set<number>(); // Set to store used ports
  let appsDirectory = 'apps'; // Path to the apps directory
  if (fs.existsSync(appsDirectory)) {
    // Check if the directory exists
    let appDirectories = fs.readdirSync(appsDirectory); // Get all directories in the apps directory ex ["my-awesome-app", "another-app", "test-app"]
    for (let appDir of appDirectories) {
      // Loop through each app directory
      let envFilePath = `${appsDirectory}/${appDir}/.env`; // Path to the .env file
      if (fs.existsSync(envFilePath)) {
        // Check if the .env file exists
        let fileContent = fs.readFileSync(envFilePath, 'utf-8'); // Read the content of the .env file
        let portMatch = fileContent.match(/PORT=(\d+)/); // Regex to find PORT= (search for PORT and capture the number)
        if (portMatch) {
          // If a match is found
          usedPorts.add(Number(portMatch[1])); // Get the number from the regex match and turn it into a number and add it to the usedPorts set
        }
      }
    }
  }

  if (!portInput) {
    // No manual port given → pick next free
    portInput = await findNextFreePort();
  } else {
    // Manual port provided → check collision
    let manualPort = Number(portInput);
    if (usedPorts.has(manualPort)) {
      // If the manual port is already in use
      let { usePortAnyway } = await prompt<{ usePortAnyway: boolean }>([
        // Ask if the user wants to use the port anyway
        {
          type: 'confirm',
          name: 'usePortAnyway',
          message: `⚠️ Port ${manualPort} is already in use. Use it anyway?`,
          initial: false,
        },
      ]);
      if (!usePortAnyway) {
        // If the user doesn't want to use the port anyway
        portInput = await findNextFreePort(); // Find the next free port
        console.log(`👉 Switching to next free port: ${portInput}`);
      }
    }
  }

  console.log(`🚀 Final PORT for app: ${portInput}`);

  let port = portInput;

  // Create src/main.ts
  tree.write(
    `${appRoot}/src/main.ts`,
    `import dotenv from 'dotenv';\n\ndotenv.config();\n\nconst port = process.env.PORT || ${port};\nconsole.log(\`🚀 Hello from app running on port \${port}\`);`,
  );

  // Create .env
  tree.write(`${appRoot}/.env`, `PORT=${port}\n`);

  // Create project.json
  tree.write(
    `${appRoot}/project.json`,
    JSON.stringify(
      {
        name: appName,
        $schema: '../../node_modules/nx/schemas/project-schema.json',
        sourceRoot: `${appRoot}/src`,
        projectType: 'application',
        targets: {
          build: {
            executor: 'nx:run-commands',
            options: {
              command: 'pnpm run build:app',
            },
          },
          start: {
            executor: 'nx:run-commands',
            options: {
              command: 'pnpm run start:app',
            },
          },
        },
        tags: [],
      },
      null,
      2,
    ),
  );

  // Create README.md
  tree.write(
    `${appRoot}/README.md`,
    `# ${appName}\n\nThis app was generated using \`company-generators:custom-app\`.\n\n> Default PORT: ${port}`,
  );

  console.log(`\n🤟 Successfully created app: ${appRoot} (PORT: ${port})\n`);

  await formatFiles(tree);
}

function sanitizeAppName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // only lowercase letters, numbers, dashes
    .replace(/--+/g, '-') // no double dashes
    .replace(/^-+|-+$/g, ''); // no starting/ending dashes
}

async function findNextFreePort(): Promise<string> {
  let appsPath = 'apps';
  let basePort = 4444;
  let existingPorts = new Set<number>();

  if (fs.existsSync(appsPath)) {
    let appDirs = fs.readdirSync(appsPath); //return directories in appsPath ["my-awesome-app", "another-app", "test-app"]
    for (let dir of appDirs) {
      let envPath = `${appsPath}/${dir}/.env`; // builds the path to the .env file
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, 'utf-8'); // reads the content of the .env file as string
        let match = content.match(/PORT=(\d+)/); // regex to find PORT= (search for PORT and capture the number)
        if (match) {
          existingPorts.add(Number(match[1])); // get the number from the regex match and turn it into a number and add it to the existingPorts set
        }
      }
    }
  }

  let port = basePort;
  while (existingPorts.has(port)) {
    port++;
  }
  return port.toString();
}

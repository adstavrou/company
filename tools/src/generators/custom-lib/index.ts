import { Tree, formatFiles } from '@nx/devkit';
import { CustomLibGeneratorSchema } from './schema';
import { prompt } from 'company-generators/prompt';

export default async function (tree: Tree, options: CustomLibGeneratorSchema) {
  if (!options.name || options.name.trim() === '') {
    let response = await prompt<{ libName: string }>([
      {
        type: 'input',
        name: 'libName',
        message: '🐸 How should we name your library?',
        validate: (value: string) => (value.trim() ? true : '👉 You must provide a name!'),
      },
    ]);
    options.name = response.libName;
  }

  if (options.build === undefined) {
    let response = await prompt<{ build: boolean }>([
      {
        type: 'confirm',
        name: 'build',
        message: '🐸 Add build target?',
      },
    ]);
    options.build = response.build;
  }

  if (options.unitTest === undefined) {
    const response = await prompt<{ unitTest: boolean }>([
      {
        type: 'confirm',
        name: 'unitTest',
        message: '🐸 Add unit testing setup?',
      },
    ]);
    options.unitTest = response.unitTest;
  }

  if (!options.files || options.files.length === 0) {
    const response = await prompt<{ files: string[] }>([
      {
        type: 'multiselect',
        name: 'files',
        message: '🐸 Select additional files to create:',
        choices: [
          { name: 'utils', message: 'utils.ts' },
          { name: 'constants', message: 'constants.ts' },
          { name: 'types', message: 'types.ts' },
        ] as { name: string; message: string }[],
      },
    ]);
    options.files = response.files as ('utils' | 'constants' | 'types')[];
  }

  let libName = sanitizeLibName(options.name);
  let libRoot = `libs/${libName}`;

  generateFile(
    tree,
    `${libRoot}/README.md`,
    `
    # ${libName}

    Generated by \`company-generators:custom-lib\`.
  `,
  );

  generateFile(
    tree,
    `${libRoot}/src/index.ts`,
    `
    export const hello = () => console.log('Hello from ${libName}!');
  `,
  );

  if (options.files?.includes('utils')) {
    generateFile(
      tree,
      `${libRoot}/src/utils.ts`,
      `
      // Utility functions

      export function exampleUtil() {
        return 'Hello from utils';
      }
    `,
    );
  }

  if (options.files?.includes('constants')) {
    generateFile(
      tree,
      `${libRoot}/src/constants.ts`,
      `
      // Constants for ${libName}

      export const EXAMPLE_CONSTANT = 'value';
    `,
    );
  }

  if (options.files?.includes('types')) {
    generateFile(
      tree,
      `${libRoot}/src/types.ts`,
      `
      // Type definitions for ${libName}

      export interface ExampleType {
        id: string;
      }
    `,
    );
  }

  let projectJson: any = {
    name: libName,
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: `${libRoot}/src`,
    projectType: 'library',
    targets: {},
    tags: [],
  };

  if (options.build) {
    projectJson.targets.build = {
      executor: 'nx:run-commands',
      options: {
        command: `echo 'Building ${libName}...'`,
      },
    };
  }

  if (options.unitTest) {
    projectJson.targets.test = generateTestTarget(libRoot);
    generateJestConfigWithPreset(libRoot, libName, tree);
    generateTsConfigForTest(libRoot, tree);
    generateExampleTest(libRoot, tree);
  }

  tree.write(`${libRoot}/project.json`, JSON.stringify(projectJson, null, 2));

  await formatFiles(tree);
}

function sanitizeLibName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateFile(tree: Tree, path: string, content: string) {
  tree.write(path, content.trim());
}

function generateJestConfigWithPreset(libRoot: string, libName: string, tree: Tree) {
  generateFile(
    tree,
    `${libRoot}/jest.config.ts`,
    `
    import type { Config } from 'jest';

    const config: Config = {
      displayName: '${libName}',
      preset: '../../jest.preset.js',
      testMatch: ['<rootDir>/src/**/*.spec.ts'],
      transform: {
        '^.+\\\\.(ts|js|mjs)$': ['ts-jest', { useESM: true }],
      },
    };

    export default config;
  `,
  );
}

function generateTsConfigForTest(libRoot: string, tree: Tree) {
  generateFile(
    tree,
    `${libRoot}/tsconfig.json`,
    JSON.stringify(
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
        include: ['src/**/*', 'jest.config.ts'],
      },
      null,
      2,
    ),
  );
}

function generateExampleTest(libRoot: string, tree: Tree) {
  generateFile(
    tree,
    `${libRoot}/src/example.spec.ts`,
    `
    describe('example', () => {
      it('should pass', () => {
        expect(1 + 1).toBe(2);
      });
    });
  `,
  );
}

function generateTestTarget(libRoot: string) {
  return {
    executor: 'nx:run-commands',
    options: {
      command: 'pnpm exec jest',
      cwd: libRoot,
    },
  };
}

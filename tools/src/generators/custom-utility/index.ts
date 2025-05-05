import { Tree, formatFiles } from '@nx/devkit';
import { CustomUtilitySchema } from './schema';
import { prompt } from 'company-generators/prompt';
import { sanitizeFileName, camelCase } from 'company-generators/naming';

export default async function (tree: Tree, options: CustomUtilitySchema) {
  if (!options.name) {
    const response = await prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: '🧪 Utility function name?',
        validate: (value: string) => value.trim() !== '' || '👉 Please provide a name!',
      },
    ]);
    options.name = response.name;
  }

  if (!options.directory) {
    const response = await prompt<{ dir: string }>([
      {
        type: 'input',
        name: 'dir',
        message: '📁 In which library? (e.g. shared, core-utils)',
        validate: (value: string) => value.trim() !== '' || '👉 Please provide a target lib!',
      },
    ]);
    options.directory = response.dir;
  }

  let fileName = sanitizeFileName(options.name);
  let fnName = camelCase(options.name);
  let target = `libs/${options.directory}/src/${fileName}.util.ts`;

  tree.write(
    target,
    `export function ${fnName}() {
  // TODO: Implement ${fnName}
}
`,
  );

  if (options.withTest) {
    tree.write(
      `libs/${options.directory}/src/${fileName}.util.spec.ts`,
      `import { ${fnName} } from './${fileName}.util';

describe('${fnName}', () => {
  it('should work', () => {
    expect(${fnName}()).toBeDefined();
  });
});
`,
    );
  }

  await formatFiles(tree);
}

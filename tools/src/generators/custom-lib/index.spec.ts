import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import generator from './index';
import { CustomLibGeneratorSchema } from './schema';

describe('custom-lib generator (snapshot)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate basic lib files and match snapshot', async () => {
    const options: CustomLibGeneratorSchema = {
      name: 'math-utils',
      build: false,
      unitTest: false,
      files: ['constants', 'utils'],
    };

    await generator(tree, options);

    expect(tree.read('libs/math-utils/src/index.ts', 'utf-8')).toMatchSnapshot();
    expect(tree.read('libs/math-utils/src/constants.ts', 'utf-8')).toMatchSnapshot();
    expect(tree.read('libs/math-utils/src/utils.ts', 'utf-8')).toMatchSnapshot();
    expect(tree.read('libs/math-utils/project.json', 'utf-8')).toMatchSnapshot();
  });
});

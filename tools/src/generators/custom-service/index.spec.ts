import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import generator from './index';
import { CustomServiceGeneratorSchema } from './schema';

describe('custom-service generator (snapshot)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate service file and match snapshot', async () => {
    const options: CustomServiceGeneratorSchema = {
      name: 'auth manager',
      directory: 'shared',
    };

    await generator(tree, options);

    const filePath = 'libs/shared/src/auth-manager.service.ts';
    const content = tree.read(filePath, 'utf-8');

    expect(content).toMatchSnapshot();
  });
});

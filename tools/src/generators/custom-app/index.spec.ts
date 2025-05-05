import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { jest } from '@jest/globals';
import type { CustomAppGeneratorSchema } from './schema';

const FIXED_APP_NAME = 'my-test-app';
const FIXED_PORT = '5555';

// Mock the enquirer module
jest.unstable_mockModule('enquirer', () => ({
  prompt: async () => ({ appName: FIXED_APP_NAME, port: FIXED_PORT }),
}));

const generator = (await import('./index')).default;

describe('custom-app generator (snapshot)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate app files and match snapshot', async () => {
    const options: CustomAppGeneratorSchema = {
      name: 'test-app',
    };

    await generator(tree, options);

    expect(tree.read('apps/test-app/app/index.ts', 'utf-8')).toMatchSnapshot();
    expect(tree.read('apps/test-app/project.json', 'utf-8')).toMatchSnapshot();
  });

  it('should create minimal app structure', async () => {
    await generator(tree, { name: FIXED_APP_NAME });

    const env = tree.read(`apps/${FIXED_APP_NAME}/.env`, 'utf-8');
    const readme = tree.read(`apps/${FIXED_APP_NAME}/README.md`, 'utf-8');
    const entry = tree.read(`apps/${FIXED_APP_NAME}/app/index.ts`, 'utf-8');
    const project = readProjectConfiguration(tree, FIXED_APP_NAME);

    expect(env).toContain(`PORT=${FIXED_PORT}`);
    expect(readme).toContain(FIXED_APP_NAME);
    expect(entry).toContain('// Entry point');
    expect(project.sourceRoot).toBe(`apps/${FIXED_APP_NAME}/app`);
  });
});

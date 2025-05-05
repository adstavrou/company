import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import generator from './index';
import { CustomUtilitySchema } from './schema';

describe('custom-utility generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('libs/shared/src/index.ts', ''); // simulate existing lib structure
  });

  it('should generate a util file in the correct location', async () => {
    const options: CustomUtilitySchema = {
      name: 'slugify-title',
      directory: 'shared',
      withTest: false,
    };

    await generator(tree, options);

    const utilPath = 'libs/shared/src/slugify-title.util.ts';
    expect(tree.exists(utilPath)).toBe(true);

    const content = tree.read(utilPath)?.toString('utf-8');
    expect(content).toContain('export function slugifyTitle()');
    expect(content).toContain('// TODO: Implement slugifyTitle');
  });

  it('should generate a spec file if withTest is true', async () => {
    const options: CustomUtilitySchema = {
      name: 'format-price',
      directory: 'shared',
      withTest: true,
    };

    await generator(tree, options);

    const specPath = 'libs/shared/src/format-price.util.spec.ts';
    expect(tree.exists(specPath)).toBe(true);

    const specContent = tree.read(specPath)?.toString('utf-8');
    expect(specContent).toContain("describe('formatPrice'");
    expect(specContent).toContain('expect(formatPrice()');
  });

  it('should generate utility file and match snapshot', async () => {
    const options: CustomUtilitySchema = {
      name: 'hello world',
      directory: 'shared',
      withTest: true,
    };

    await generator(tree, options);

    const filePath = 'libs/shared/src/hello-world.util.ts';
    const fileContent = tree.read(filePath, 'utf-8');
    expect(fileContent).toMatchSnapshot();

    const testFilePath = 'libs/shared/src/hello-world.util.spec.ts';
    const testContent = tree.read(testFilePath, 'utf-8');
    expect(testContent).toMatchSnapshot();
  });
});

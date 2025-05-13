import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import generator from './index';

describe('add-demo-code generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    tree.write(
      'apps/demo-code-snippets/src/main.ts',
      `const demos: Record<string, string> = {};

// ⬇ DEMO-REGISTER`,
    );
  });

  it('should create full demo folder structure', async () => {
    await generator(tree, { name: 'your-demo' });

    const base = 'apps/demo-code-snippets/src/demos/your-demo';

    expect(tree.exists(`${base}/index.ts`)).toBe(true);
    expect(tree.exists(`${base}/demo.md`)).toBe(true);
    expect(tree.exists(`${base}/demo.html`)).toBe(true);
    expect(tree.exists(`${base}/demo.css`)).toBe(true);
    expect(tree.exists(`${base}/demo.ts`)).toBe(true);
    expect(tree.exists(`${base}/code-files.ts`)).toBe(true);
    expect(tree.exists(`${base}/index.html`)).toBe(true);

    const manifest = tree.read(`${base}/code-files.ts`, 'utf-8')!;
    expect(manifest).toContain('demo.html');
    expect(manifest).toContain('demo.css');
    expect(manifest).toContain('demo.ts');

    const mainTs = tree.read('apps/demo-code-snippets/src/main.ts', 'utf-8')!;
    expect(mainTs).toContain("demos['your-demo'] = './demos/your-demo/demo.html';");
  });

  it('should not overwrite existing main.ts if already exists', async () => {
    await generator(tree, { name: 'another-demo' });
    const mainTs = tree.read('apps/demo-code-snippets/src/main.ts', 'utf-8')!;
    expect(mainTs).toContain("demos['another-demo'] = './demos/another-demo/demo.html';");
  });
});

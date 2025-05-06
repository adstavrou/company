import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import generator from './index';

describe('add-demo base generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    // Add basic index.html to simulate demo-code-snippets root
    tree.write(
      'apps/demo-code-snippets/src/index.html',
      `<!DOCTYPE html>
<html>
  <body>
    <ul>
      <!-- DEMO-LIST -->
    </ul>
  </body>
</html>`,
    );
  });

  it('should create basic demo-code-snippets app structure', async () => {
    await generator(tree, { name: 'your-demo' });

    expect(tree.exists('apps/demo-code-snippets/src/your-demo/index.html')).toBe(true);
    expect(tree.exists('apps/demo-code-snippets/src/your-demo/script.ts')).toBe(true);
    expect(tree.exists('apps/demo-code-snippets/src/your-demo/style.css')).toBe(true);

    let indexHtml = tree.read('apps/demo-code-snippets/src/index.html', 'utf-8');
    expect(indexHtml).toContain('<li><a href="./your-demo/index.html">your-demo</a></li>');
    expect(indexHtml).toContain('<!-- DEMO-LIST -->');
  });

  it('should generate expected index.html structure (snapshot)', async () => {
    await generator(tree, { name: 'snapshot-demo' });

    let result = tree.read('apps/demo-code-snippets/src/index.html', 'utf-8');
    expect(result).toMatchSnapshot();
  });
});

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { readFileIfExists } from './fs'; // θα προσθέσουμε αυτό το helper

describe('fs helpers', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should write and read a file', () => {
    const path = 'libs/test-file.ts';
    const content = 'hello';
    tree.write(path, content);

    const result = readFileIfExists(tree, path);
    expect(result).toBe(content);
  });

  it('should return null if file does not exist', () => {
    const result = readFileIfExists(tree, 'libs/missing.ts');
    expect(result).toBe(null);
  });
});

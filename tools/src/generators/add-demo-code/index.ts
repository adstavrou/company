import { Tree, formatFiles } from '@nx/devkit';
import { prompt } from 'company-generators/prompt';

export default async function (tree: Tree, options: { name?: string }) {
  if (!options.name) {
    const res = await prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: '🧪 What is the name of the new demo?',
        validate: (value: string) => value.trim() !== '' || '👉 Name is required!',
      },
    ]);
    options.name = res.name;
  }

  let demoName = options.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');
  let demoDir = `apps/demo-code-snippets/src/${demoName}`;

  // Step 2: Create demo files
  tree.write(
    `${demoDir}/index.html`,
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${demoName}</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>${demoName}</h1>
  <script type="module" src="./script.ts"></script>
</body>
</html>`,
  );

  tree.write(`${demoDir}/script.ts`, `console.log('${demoName} script loaded');`);
  tree.write(`${demoDir}/style.css`, 'body { font-family: sans-serif; }');

  // Step 3: Update central index.html
  let indexPath = 'apps/demo-code-snippets/src/index.html';
  if (tree.exists(indexPath)) {
    let content = tree.read(indexPath, 'utf-8')!;
    let marker = '<!-- DEMO-LIST -->';
    if (content.includes(marker)) {
      let link = `    <li><a href="./${demoName}/index.html">${demoName}</a></li>`;
      content = content.replace(marker, `${link}\n    ${marker}`);
      tree.write(indexPath, content);
    }
  }

  await formatFiles(tree);
}

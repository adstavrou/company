import { Tree, formatFiles } from '@nx/devkit';
import { prompt } from 'company-generators/prompt';

export default async function (tree: Tree, options: { name?: string }) {
  // Prompt name if missing
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

  // Sanitize name
  let demoName = options.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

  // Paths
  const baseDir = `apps/demo-code-snippets/src/demos/${demoName}`;

  // index.ts
  tree.write(
    `${baseDir}/index.ts`,
    `import Prism from 'prismjs';
import { marked } from 'marked';
import '/assets/styles/header.css';
import '/assets/styles/footer.css';
import '/assets/styles/DemoViewer.css';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-tomorrow.css';

import description from './demo.md?raw';
import codeFiles from './code-files';

function escape(code: string): string {
  return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function loadTemplateElement(id: string): Promise<HTMLTemplateElement> {
  const res = await fetch(` +
      '`../../assets/templates/${id}.html`' +
      `);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const tpl = doc.getElementById(` +
      '`${id}-template`' +
      `) as HTMLTemplateElement;
  if (!tpl) throw new Error(` +
      '`Template ${id}-template not found`' +
      `);
  return tpl;
}

async function main() {
  const root = document.getElementById('root')!;
  root.innerHTML = '';

  const [headerTpl, footerTpl] = await Promise.all([
    loadTemplateElement('header'),
    loadTemplateElement('footer'),
  ]);

  const header = headerTpl.content.cloneNode(true);
  const footer = footerTpl.content.cloneNode(true);

  const rawFiles = import.meta.glob('./demo.*', {
    query: '?raw',
    eager: true,
  });

  const codeHtmlBlocks: string[] = codeFiles.map((filename) => {
    const key = ` +
      '`./${filename}`' +
      `;
    const mod = rawFiles[key];
    if (!mod) return \`<pre><code>// \${filename} not found</code></pre>\`;
    const raw = (mod as { default: string }).default;
    const ext = filename.split('.').pop();
    return ` +
      '`\n<pre class="line-numbers">\n  <code class="language-${ext}">${escape(raw)}</code>\n</pre>`' +
      `;
  });

  const demoName = location.pathname.split('/').slice(-2)[0];

  const content = ` +
      '`\n<section>\n  <h1>${demoName}</h1>\n  <div>${marked.parse(description)}</div>\n  <a href="./demo.html" target="_blank">👉 Open demo</a>\n  ${codeHtmlBlocks.join(\'\\n\')}\n</section>`' +
      `;

  root.appendChild(header);
  root.insertAdjacentHTML('beforeend', content);
  root.appendChild(footer);

  Prism.highlightAll();
}

main();`,
  );

  // demo.md
  tree.write(
    `${baseDir}/demo.md`,
    `This is the **${demoName}** demo snippet.\n\nFeel free to update this description.`,
  );

  // demo files
  tree.write(
    `${baseDir}/demo.html`,
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${demoName}</title>
    <link rel="stylesheet" href="./demo.css" />
  </head>
  <body>
    <button id="btn">Click me</button>
    <script type="module" src="./demo.ts"></script>
  </body>
</html>`,
  );

  tree.write(
    `${baseDir}/index.html`,
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${demoName}</title>
  </head>
  <body>
    <div id="root">Loading…</div>
    <script type="module" src="./index.ts"></script>
  </body>
</html>`,
  );

  tree.write(
    `${baseDir}/demo.ts`,
    `document.getElementById('btn')?.addEventListener('click', () => {
  alert('Hello from ${demoName}!');
});`,
  );

  tree.write(
    `${baseDir}/demo.css`,
    `body {
  font-family: sans-serif;
  padding: 2em;
}
button {
  padding: 0.5em 1.5em;
  border: none;
  background: dodgerblue;
  color: white;
  border-radius: 0.25em;
  cursor: pointer;
}`,
  );

  // code-files.ts
  tree.write(`${baseDir}/code-files.ts`, "export default ['demo.html', 'demo.css', 'demo.ts'];");

  // 🔄 Update main.ts list rendering
  const mainTsPath = 'apps/demo-code-snippets/src/main.ts';
  if (tree.exists(mainTsPath)) {
    const main = tree.read(mainTsPath, 'utf-8')!;
    const marker = '// ⬇ DEMO-REGISTER';
    if (main.includes(marker)) {
      const insert = `  demos['${demoName}'] = './demos/${demoName}/demo.html';`;
      const updated = main.replace(marker, `${insert}\n  ${marker}`);
      tree.write(mainTsPath, updated);
    }
  }

  await formatFiles(tree);
}

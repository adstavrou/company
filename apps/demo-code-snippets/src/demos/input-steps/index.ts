import '/assets/styles/presentation.css';
import '/assets/styles/header.css';
import '/assets/styles/footer.css';
import '/assets/styles/DemoViewer.css';

import Prism from 'prismjs';
import { marked } from 'marked';

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
  const res = await fetch(`../../assets/templates/${id}.html`);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const tpl = doc.getElementById(`${id}-template`) as HTMLTemplateElement;
  if (!tpl) throw new Error(`Template ${id}-template not found`);
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

  // Load code files listed
  const rawFiles = import.meta.glob('./demo.*', {
    query: '?raw',
    eager: true,
  });

  const codeHtmlBlocks: string[] = codeFiles.map((filename) => {
    const key = `./${filename}`;
    const mod = rawFiles[key];
    if (!mod) return `<pre><code>// file ${filename} not found</code></pre>`;
    const raw = (mod as { default: string }).default;
    const ext = filename.split('.').pop();
    return `
      <pre class="line-numbers">
        <code class="language-${ext}">${escape(raw.trim())}</code>
      </pre>
    `;
  });

  const demoName = location.pathname.split('/').slice(-2)[0];

  const content = `
    <section>
      <h1>${demoName}</h1>
      <div>${marked.parse(description)}</div>
      <a href="./demo.html" target="_blank">👉 Open demo</a>
      ${codeHtmlBlocks.join('\n')}
    </section>
  `;

  root.appendChild(header);
  root.insertAdjacentHTML('beforeend', content);
  root.appendChild(footer);

  Prism.highlightAll();
}

main();

import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import description from '../../input-steps/demo.md?raw';
import templateHtml from '../templates/DemoViewer.html?raw';

function escapeHtml(code: string): string {
  return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

//demo change

export class DemoViewer extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Load template
    shadow.innerHTML = templateHtml;
    const template = shadow.getElementById('demo-viewer') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;

    shadow.innerHTML = ''; // clear raw template
    shadow.appendChild(content);
  }

  async connectedCallback() {
    const shadow = this.shadowRoot!;
    shadow.querySelector('#demo-title')!.textContent =
      this.getAttribute('title') || 'Untitled Demo';

    try {
      const descHtml = marked.parse(description);
      shadow.querySelector('#description')!.innerHTML = descHtml as string;
    } catch {
      shadow.querySelector('#description')!.textContent = 'No description';
    }

    const link = shadow.querySelector('#demo-link') as HTMLAnchorElement;
    link.href = new URL('../demo.html', import.meta.url).pathname;

    const files = import.meta.glob('../demo.{html,css,ts,js}', {
      query: '?raw',
      import: 'default',
      eager: true,
    });

    const codeContainer = shadow.querySelector('#code-blocks')!;
    for (const path in files) {
      const ext = path.split('.').pop();
      const raw = escapeHtml((files[path] as string).trim());

      const pre = document.createElement('pre');
      pre.className = 'line-numbers';
      const codeEl = document.createElement('code');
      codeEl.className = `language-${ext}`;
      codeEl.innerHTML = raw;
      pre.appendChild(codeEl);
      codeContainer.appendChild(pre);
    }

    Prism.highlightAllUnder(shadow);
  }
}

customElements.define('demo-viewer', DemoViewer);

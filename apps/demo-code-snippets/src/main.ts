import './assets/styles/header.css';
import './assets/styles/footer.css';
import './assets/styles/presentation.css';
import './assets/styles/list.css';

async function loadTemplateElement(id: string): Promise<HTMLTemplateElement> {
  const res = await fetch(`./assets/templates/${id}.html`);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const tpl = doc.getElementById(`${id}-template`) as HTMLTemplateElement;
  if (!tpl) {
    throw new Error(`Template with id="${id}-template" not found`);
  }
  return tpl;
}

async function main() {
  const root = document.getElementById('root')!;
  root.innerHTML = '';

  const [headerTpl, listTpl, footerTpl] = await Promise.all([
    loadTemplateElement('header'),
    loadTemplateElement('list'),
    loadTemplateElement('footer'),
  ]);

  const header = headerTpl.content.cloneNode(true);
  const list = listTpl.content.cloneNode(true) as HTMLElement;
  const footer = footerTpl.content.cloneNode(true);

  root.appendChild(header);
  root.appendChild(list);
  root.appendChild(footer);

  const listEl = root.querySelector('#demo-list');
  if (!listEl) return;

  const demos = import.meta.glob('./demos/**/demo.md', { eager: true });

  for (const path in demos) {
    const name = path.split('/')[2];

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `./demos/${name}/index.html`;
    a.textContent = name;
    a.target = '_blank';
    li.appendChild(a);
    listEl.appendChild(li);
  }
}

main();

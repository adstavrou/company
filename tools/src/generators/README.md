# 📚 How to Create a New Generator

This guide explains how to add a new custom generator to the company workspace.

---

## ✨ Steps to Create a New Generator

### 1. Create a new generator folder
Inside the `tools/src/generators/` directory:

```
tools/
└── src/
    └── generators/
        └── your-generator-name/
            ├── index.ts
            ├── schema.json
            ├── schema.d.ts
            └── README.md (optional, but recommended)
```

**Example:** 
If you want to create a `custom-service` generator:
```
tools/src/generators/custom-service/
```

---

### 2. Create the basic generator files

#### `index.ts`
The generator logic:
```ts
import { Tree, formatFiles } from '@nx/devkit';
import { prompt } from 'company-generators/prompt';

export default async function (tree: Tree, options: any) {
  if (!options.name) {
    const response = await prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name?'
      }
    ]);
    options.name = response.name;
  }

  const projectRoot = `libs/${options.name}`;
  tree.write(`${projectRoot}/src/index.ts`, `// Start of ${options.name}\n`);

  await formatFiles(tree);
}
```

#### `schema.json`
The options definition:
```json
{
  "$schema": "http://json-schema.org/schema",
  "title": "Custom Service Generator",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the service"
    }
  },
  "required": []
}
```

#### `schema.d.ts`
The TypeScript schema definition:
```ts
export interface Schema {
  name: string;
}
```

---

### 3. Register the generator

Update your plugin entry point in:
```
tools/src/index.ts
```

```ts
export { default as customService } from './generators/custom-service';
```

And declare the alias in `tsconfig.base.json`:
```json
"paths": {
  "company-generators": ["tools/src/index.ts"]
}
```

Now your generator is accessible as:
```bash
nx g company-generators:customService
```

---

### 4. Generate using your new generator

```bash
pnpm exec nx g company-generators:customService
```

With options:
```bash
pnpm exec nx g company-generators:customService --name=my-awesome-service
```

---

## ✨ Extra Notes

### ✅ Best Practices
- Always include a `README.md` inside your generator folder.
- Keep prompts user-friendly and validated.
- Prefer named exports for helpers.
- Name your generators consistently (e.g. `custom-xxx`, `init-xxx`).

### 🧠 Project Access
If your generator uses `getProjects(tree)` (e.g. barrel generator):
- Make sure the library has a `project.json` file
- Or is defined in the `workspace.json`/`nx.json`

---

## ⚡ Bonus Tip: Snapshot Testing
Use snapshot testing to validate output of generated files:
```ts
expect(tree.read('libs/shared/src/foo.util.ts', 'utf-8')).toMatchSnapshot();
```

To update snapshots:
```bash
pnpm test:tools -u
```

---

## 🏁 Final Words
Whenever you need a custom structure or boilerplate, always prefer building a generator over manual repetition.

🚀 Automation > Repetition

🐸 Have fun and keep things DRY!

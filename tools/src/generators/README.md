# 📚 How to Create a New Generator

This guide explains how to add a new custom generator to the company workspace.
---
## ✨ Steps to Create a New Generator
### 1. Create a new generator folder
Inside the tools/src/generators/ directory:

```
tools/
└── src/
    └── generators/
        └── your-generator-name/
            ├── index.ts
            ├── schema.json
            └── README.md (optional, but recommended)
```

**Example:** 

If you want to create a custom-service generator:
```
tools/src/generators/custom-service/
```
---

### 2. Create the basic generator files
`index.ts`  (the generator logic):
```ts
import { Tree, formatFiles } from '@nx/devkit';
import { prompt } from 'enquirer';

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
---
`schema.json` (the options definition):
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
---
### 3. Register the generator
Update the `tools/workspace.json` (~~or `nx.json` if you're managing there~~) to register your generator:
```json
{ 
    ...
    "custom-service": {
        "factory": "./tools/src/generators/custom-service",
        "schema": "./tools/src/generators/custom-service/schema.json",
        "description": "Create a new service class"
      }
    ...
}
```

**✅ Now custom-service will be available to generate via Nx!**

---
### 4. Generate using your new generator
```bash
pnpm exec nx g company-generators:custom-service
```
or
```bash
pnpm exec nx g company-generators:custom-service --name=my-awesome-service
```
---
### 🎯 Best Practices
- Always include a README.md inside your generator folder explaining what it does.

- Keep your prompts friendly and clear.

- Validate all user input inside the generator (prompt validation).

- Name your generators consistently (e.g., custom-xxx).

---
## ⚡ Bonus Tip
You can scaffold even complex projects: apps, libs, configs, environment files, etc.
Generators are powerful and keep your monorepo fast, scalable, and DRY!

## ✨ Final Words
Whenever you need a new custom template,
always prefer building a generator over manual copy-pasting.

Automation > Repetition 🚀

🐸 Have fun 



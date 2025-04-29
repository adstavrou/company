# 📚 Custom Library Generator - `custom-lib`

This generator creates a new library inside the `libs/` folder with optional support for additional utility files.

---

## ✨ How to use

### 1. Run the generator

```bash
pnpm exec nx g company-generators:custom-lib
or
pnpm exec nx g company-generators:custom-lib --name=shared-core --files=utils,types
```

**You will be prompted for:**
- 🐸 Library name: Name of the new lib folder (e.g. shared)
- 🐸 Add build target?: Adds a build command to project.json
- 🐸 Add unit testing setup?: Adds testing setup (optional)
- Select additional files:
  - utils.ts
  - constants.ts
  - types.ts

---

### 2. Optional: Provide the name immediately
You can skip the prompt by passing the --name flag:

```bash
pnpm exec nx g company-generators:custom-lib --name=my-utils
```
----

### 📦 What it generates

```
libs/shared/
├── src/
│   ├── index.ts
│   ├── utils.ts
│   ├── constants.ts
│   └── types.ts
├── README.md
└── project.json
```
- index.ts: Basic starting file with a simple export.

- README.md: Basic documentation file.

- project.json: Nx project configuration (with build/test targets if selected).

---

## 🛠️ Targets

Based on your answers, the project.json will include:

- build: A basic command simulating a build process.

- test: A basic command simulating a testing process.

- Both targets can easily be customized later.

---
## ⚡ Example
Running:

```bash
pnpm exec nx g company-generators:custom-lib --name=super-utils
```
Will generate:
```
libs/super-utils/
  ├── src/index.ts
  ├── README.md
  └── project.json
```
---
## 🎯 Notes
- If you run without --name, the generator will prompt you for a name.

- This generator is part of the local company-generators workspace tools.

- The generated library is a minimal starting point and can be extended as needed.

- The files option is optional and supports comma-separated values:
```bash
--files=utils,constants
```

---

✅ This generator is part of company-generators
Feel free to extend it as your monorepo grows!

## Have Fun 🐸

# 📚 Custom Library Generator - `custom-lib`

This generator creates **simple library projects** inside the `libs/` directory.

---

## ✨ How to use

### 1. Run the generator

```bash
pnpm exec nx g company-generators:custom-lib
```

**You will be prompted for:**
- The name of the library
- Whether you want to add a build target
- Whether you want to add a unit testing setup

---

### 2. Optional: Provide the name immediately
You can skip the prompt by passing the --name flag:

```bash
pnpm exec nx g company-generators:custom-lib --name=my-utils
```
----

### 📦 What it generates

```
libs/
└── my-utils/
    ├── src/
    │   └── index.ts
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

---

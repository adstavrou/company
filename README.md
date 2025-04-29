# 🏢 Company Monorepo

Welcome! This is a **monorepo** project managed with [Nx](https://nx.dev/), using:
- TypeScript
- pnpm
- esbuild
- ESLint + Prettier (Flat Config)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- pnpm (v8+ recommended)

Install dependencies:
```bash
pnpm install
```

## 📦 Scripts

Command | Description
pnpm run lint | Run ESLint checks
pnpm run lint:fix | Run ESLint and auto-fix problems
pnpm run build | Build all apps/libs (soon)
pnpm run serve | Serve an app manually (soon per app)

## Generators

### Available Generators

- **custom-app**  
  - **Base command:** `pnpm exec nx g company-generators:custom-app`
  - **Description:** Creates a new base application inside `apps/`, with initial structure and configuration.

- **It will:**
  - Ask for the app name
  - Ask for the app port
  - Create the app under /apps/
  - Setup .env, main.ts, README.md, and project.json

## 📚 Project Structure

```plaintext
company/
├── apps/
│   └── my-awesome-app/
│       ├── src/
│       │   └── main.ts
│       ├── .env
│       ├── project.json
│       └── README.md
├── tools/
│   └── src/
│       └── generators/
│           └── custom-app/
│               ├── index.ts
│               ├── schema.d.ts
│               └── schema.json
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── node_modules/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

---
---
# 🛠️ Company Monorepo Cheatsheet

## 🚀 Custom Generators

| Purpose    | Command Example |
| -------- | ------- |
| Create a new App | `pnpm exec nx g company-generators:custom-app --name=my-awesome-app` |
| Create a new Lib	 | `pnpm exec nx g company-generators:custom-lib --name=my-utils-lib` |
| Create a Service	    | `pnpm exec nx g company-generators:custom-service --name=my-service`	    |

---

## 🛠️ Linting

| Purpose    | Command Example |
| -------- | ------- |
| Lint all files | `pnpm run lint` |
| Auto-fix lint issues		 | Save the file in VSCode (with ESLint & Format on Save enabled) |

---

## 🧹 Cleaning

| Purpose    | Command |
| -------- | ------- |
| Clean node_modules	 | `pnpm install --force` |
| Clean Nx cache/temp	 | pnpm exec nx reset |

---

# 📚 Notes
- Always prefer running generators instead of copy-pasting folders manually.

- Keep the workspace clean: run `pnpm run lint` and `pnpm exec nx format:write` before commits.

- Prefer let for variables (unless you're 100% sure it ***MUST*** not change).

---

# ⚡ Example Generator Run
```bash
pnpm exec nx g company-generators:custom-app --name=my-app
```
**Creates:**
```
apps/
└── my-app/
    ├── src/
    │   └── main.ts
    ├── .env
    ├── README.md
    └── project.json
```

# 🐸 Have fun


                                    
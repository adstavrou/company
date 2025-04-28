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



                                                            
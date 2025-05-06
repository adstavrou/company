# 🏢 Company Monorepo

Welcome! This is a **monorepo** project managed with [Nx](https://nx.dev/), using:

- TypeScript
- pnpm
- esbuild
- ESLint + Prettier (Flat Config)
- Custom Nx generators (under `tools/src/generators`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- pnpm (v8+ recommended)

Install dependencies:
```bash
pnpm install
```

---

## 📆 Scripts

| Command              | Description                        |
|---------------------|------------------------------------|
| `pnpm run lint`     | Run ESLint checks                  |
| `pnpm run lint:fix` | Run ESLint and auto-fix problems   |
| `pnpm run build`    | Build all apps/libs (coming soon)  |
| `pnpm run serve`    | Serve an app manually (soon)       |
| `pnpm test:tools`   | Run Jest tests for custom tools    |

---

## ⚙️ Custom Generators

All generators live under `tools/src/generators/` and are invoked via the alias `company-generators`.

To add a new one, follow the steps in `tools/src/generators/README.md`.

---

### 🧪 Available Generators

#### `custom-app`
- **Command:** `pnpm exec nx g company-generators:custom-app`
- **Description:** Creates a new base application inside `apps/`
- **Prompts for:**
  - App name
  - Port number
- **Generates:** `.env`, `main.ts`, `README.md`, `project.json`

#### `custom-lib`
- **Command:** `pnpm exec nx g company-generators:custom-lib`
- **Description:** Creates a new library inside `libs/`
- **Supports:**
  - Optional files: `utils.ts`, `constants.ts`, `types.ts`
  - Optional Jest test setup
  - Optional build target

#### `custom-service`
- **Command:** `pnpm exec nx g company-generators:custom-service`
- **Description:** Adds a `*.service.ts` class file inside a library
- **Prompts for:**
  - Service name
  - Target directory under `libs/`

#### `custom-utility`
- **Command:** `pnpm exec nx g company-generators:custom-utility`
- **Description:** Adds a `*.util.ts` file to a lib, optionally with test

#### `barrel`
- **Command:** `pnpm exec nx g company-generators:barrel --project=my-lib`
- **Description:** Generates or updates a `src/index.ts` with barrel exports

#### `add-demo-code`
- **Command:** `pnpm exec nx g company-generators:add-demo-code`
- **Description:** Adds a new demo folder inside `apps/demo-code-snippets/src/`
- **Prompts for:**
  - Name of the demo
- **Generates:**
  - `index.html`
  - `script.ts`
  - `style.css`
  - Updates the main `index.html` list

---

## 📚 Project Structure

```plaintext
company/
├── apps/
│   ├── my-app/
│   │   ├── src/
│   │   ├── .env
│   │   └── project.json
│   └── demo-code-snippets/
│       ├── src/
│       │   ├── index.html
│       │   └── [demo folders]
│       ├── .env
│       └── project.json
├── libs/
│   └── my-lib/
│       ├── src/
│       └── project.json
├── tools/
│   ├── libs/              # internal helpers (prompt, naming, fs)
│   │   └── src/
│   └── src/
│       └── generators/
│           ├── custom-app/
│           ├── custom-lib/
│           ├── custom-service/
│           ├── custom-utility/
│           ├── barrel/
│           └── add-demo-code/
├── tsconfig.base.json
└── README.md
```

---

## 📖 Cheatsheet

### 🚀 Generator Commands

| Purpose             | Command Example                                                      |
|---------------------|----------------------------------------------------------------------|
| Create a new app    | `pnpm exec nx g company-generators:custom-app --name=my-app`         |
| Create a new lib    | `pnpm exec nx g company-generators:custom-lib --name=core-utils`     |
| Create a service    | `pnpm exec nx g company-generators:custom-service --name=auth`       |
| Create a utility    | `pnpm exec nx g company-generators:custom-utility --name=slugify`    |
| Barrel index.ts     | `pnpm exec nx g company-generators:barrel --project=core-utils`      |
| Add demo code       | `pnpm exec nx g company-generators:add-demo-code`                   |

---

### 🛠️ Linting

| Purpose              | Command                          |
|----------------------|----------------------------------|
| Lint all files       | `pnpm run lint`                  |
| Auto-fix issues      | `pnpm run lint:fix` or save in VSCode |

---

### 🩹 Cleaning

| Purpose               | Command                         |
|-----------------------|---------------------------------|
| Clean node_modules    | `pnpm install --force`          |
| Clean Nx cache        | `pnpm exec nx reset`            |

---

## 🔧 Generator Setup

- Declare each generator in `tools/src/index.ts`
- Add aliases in `tsconfig.base.json`:
```json
"paths": {
  "company-generators": ["tools/src/index.ts"],
  "company-generators/prompt": ["tools/libs/src/prompt.ts"]
}
```
- Barrel your helpers in `tools/libs/src/index.ts`

---

## 💡 Notes
- Prefer generators over copy-pasting folders manually
- Run `pnpm exec nx format:write` and `pnpm run lint` before committing
- Prefer `let` unless a variable **must** never change
- Keep your libraries clean and encapsulated (no messy exports)

---

## 🐸 Final Tip
```bash
pnpm exec nx g company-generators:custom-app --name=my-app
```
Creates:
```
apps/
└── my-app/
    ├── src/main.ts
    ├── .env
    └── project.json
```

---

# 🧪 Test your generators with confidence
Run snapshot tests with:
```bash
pnpm test:tools
```
Update snapshots with:
```bash
pnpm test:tools -u
```

---

🚀 Keep automating. Stay DRY. Enjoy the ride.

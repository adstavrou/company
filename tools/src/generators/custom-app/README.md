# 🧱 Custom App Generator

Creates a new application under the `apps/` folder, with essential structure, `.env`, and test-ready setup.

---

## 🧪 Usage

Run the generator:
```bash
pnpm exec nx g company-generators:custom-app
```

You’ll be prompted to:
- Enter a name for the app
- Choose a port (or leave blank for auto)

Or run with flags:
```bash
pnpm exec nx g company-generators:custom-app --name=my-cool-app
```

---

## 📁 Output Structure

```plaintext
apps/
└── my-cool-app/
    ├── .env               # Port configuration
    ├── README.md          # Basic app info
    ├── app/
    │   ├── index.ts       # Entry point
    │   ├── styles.css     # Optional styles
    │   └── assets/
    │       └── .gitkeep
    ├── project.json       # Nx project config
    └── tsconfig.json      # TypeScript setup
```

---

## ⚙️ Features

- Ensures **valid and sanitized app name**
- Auto-detects used ports across `apps/` and finds the next free one
- Adds a `.env` with assigned port
- Generates `README.md`, `tsconfig.json`, `project.json`
- Clean and minimal setup — ready to extend

---

## 🛡️ Validations

- **Name is required** (prompted if not given)
- **PORT** is checked against other `.env` files under `apps/`
- Falls back to default starting port (4444) if needed

---

## 📦 Extras

- Includes basic Jest config via `types: ['jest']`
- Generated project is ready for unit tests (if needed later)

---

## 💡 Tip

Run `pnpm exec nx list company-generators` to view all available generators.

---

> Generator: `company-generators:custom-app`  
> Created as much as possible 🚀

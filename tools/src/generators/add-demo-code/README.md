# ✨ Add Demo Code Generator

This generator adds a new **demo snippet** to the `apps/demo-code-snippets/` app.
Each demo includes:

* a **public-facing live example** (`demo.html`)
* a **preview page** (`index.ts`) that displays code with PrismJS
* a **list of code files** declared in `code-files.ts`

---

## 🚀 Usage

Run the generator:

```bash
pnpm exec nx g company-generators:add-demo-code
```

You’ll be prompted to:

* Enter a name for the new demo

Or run with flags:

```bash
pnpm exec nx g company-generators:add-demo-code --name="hello world"
```

---

## 📁 Output Structure

```plaintext
apps/demo-code-snippets/
└── src/
    └── demos/
        └── your-demo/
            ├── index.ts         # Demo preview logic (PrismJS)
            ├── index.html       # Entry point for preview
            ├── demo.html        # Live example page
            ├── demo.css         # Styling
            ├── demo.ts          # Optional JS/TS logic
            ├── demo.md          # Markdown description
            └── code-files.ts    # Manifest of code files to display
```

---

## ⚙️ Features

* Validates and sanitizes the demo name
* Creates all necessary folders and files
  * `index.ts`, `index.html`, `demo.md`, `demo.html`, `demo.css`, `demo.ts`
  * `code-files.ts` for specifying visible code files
* Automatically updates `src/main.ts`
  * Appends a line like:

```ts
  demos['your-demo'] = './demos/your-demo/demo.html';
```

right above this marker:

```ts
// ⬇ DEMO-REGISTER
```

---

## 🛡️ Validations

* **Name is required**
* Only lowercase letters, numbers, and dashes are allowed
* Spaces and special characters are auto-converted to `-`

---

## 💡 Tips

Make sure `apps/demo-code-snippets/src/main.ts` contains the marker:

```ts
// ⬇ DEMO-REGISTER
```

This is where the generator appends demo routes.

To control which files are visible in the code preview:

```ts
// code-files.ts
export default ['demo.html', 'demo.css', 'demo.ts'];
```

You can include or omit files freely.

---

> Generator: `company-generators:add-demo-code`
> Ideal for building isolated, interactive, and previewable code demos in your monorepo.

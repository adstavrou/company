# ✨ Add Demo Code Generator

This generator adds a new **demo folder** under the `apps/demo-code-snippets/src/` directory.  
Each demo is a standalone HTML/JS/CSS combo, and automatically gets linked from the main `index.html`.

---

## 🚀 Usage

Run the generator:

```bash
pnpm exec nx g company-generators:add-demo-code
```

You’ll be prompted to:
- Enter a name for the new demo

Or run with flags:

```bash
pnpm exec nx g company-generators:add-demo-code --name="hello world"
```

---

## 📁 Output Structure

```plaintext
apps/demo-code-snippets/
└── src/
    ├── index.html              # Central index with demo links
    └── your-demo/
        ├── index.html          # Basic HTML page
        ├── script.ts           # Linked JS/TS logic
        └── style.css           # Stylesheet
```

---

## ⚙️ Features

- Ensures **valid and sanitized demo name**
- Creates demo folder with:
  - `index.html`
  - `script.ts`
  - `style.css`
- Automatically updates central `index.html`:
  - Inserts new `<li><a href=...>` above the `<!-- DEMO-LIST -->` marker

---

## 🛡️ Validations

- **Name is required**
- Only lowercase letters, numbers, and dashes are allowed
- Spaces and special characters are auto-converted to `-`

---

## 💡 Tip

Make sure `apps/demo-code-snippets/src/index.html` contains this marker:
```html
<!-- DEMO-LIST -->
```
This is where new demos will be inserted.

---

> Generator: `company-generators:add-demo-code`  
> Ideal for showcasing isolated HTML/TS/CSS examples in your monorepo

# Custom App Generator

This generator creates a new application inside the monorepo, under the `apps/` directory.  
It sets up the initial project structure and applies basic TypeScript configuration.

---
## Base Command

```bash
pnpm exec nx g company-generators:custom-app
```


---

## Usage Examples

**Simple name (no spaces):**

```
bash
pnpm exec nx g company-generators:custom-app --name=my-app
```
Name with spaces (quotes are required):
```
bash
pnpm exec nx g company-generators:custom-app --name="awesome project"
```

---

## Features

- Validates that the app name is non-empty.
- Accepts only English letters (`a-z`, `A-Z`), numbers (`0-9`), and hyphens (`-`).
- Rejects names with invalid characters or non-English input.
- Creates:
  - `src/main.ts`
  - `README.md`
  - `tsconfig.app.json`
- Places the app under `apps/`.

---

## Validation Rules

- **Required:** App name must not be empty.
- **Allowed Characters:** Only letters (a-z, A-Z), numbers (0-9), and hyphens (-).
- **Spaces:** If the name includes spaces, enclose it in quotes.

---

## Example Structure

```plaintext
apps/
└── my-app/
    ├── src/
    │   └── main.ts
    ├── README.md
    └── tsconfig.app.json
```

---

## Notes

- This generator focuses on setting up a basic ready-to-extend app.
- Further configuration (e.g., serve targets) can be added later.



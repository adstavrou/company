# 🧰 Custom Utility Generator

Generates a utility function inside an existing library, following clean naming and optional testing structure.

---

## 🧪 Usage

```bash
pnpm exec nx g company-generators:custom-utility
```

Or with options:
```bash
pnpm exec nx g company-generators:custom-utility --name=slugify --directory=shared --withTest
```

---

## 🙋 Prompts
- 🧪 Utility function name
- 📁 Target library (under `libs/`)
- ✅ Include `.spec.ts` test file?

---

## 📄 Example Output

### 🧠 Source file
```ts
// libs/shared/src/slugify.util.ts
export function slugify() {
  // TODO: Implement slugify
}
```

### 🧪 Test file (if selected)
```ts
// libs/shared/src/slugify.util.spec.ts
import { slugify } from './slugify.util';

describe('slugify', () => {
  it('should work', () => {
    expect(slugify()).toBeDefined();
  });
});
```

---

## 🛠 Implementation Notes

- Uses `company-generators/prompt` for input
- Applies `sanitizeFileName()` and `camelCase()` for filename and function name respectively
- Follows Nx `Tree.write()` API
- Automatically formats files via `formatFiles(tree)`

---

## 🧼 Example Test (Snapshot-Based)

Snapshot testing verifies the output:
```ts
expect(tree.read('libs/shared/src/slugify.util.ts', 'utf-8')).toMatchSnapshot();
```
Update snapshot with:
```bash
pnpm test:tools -u
```

---

## 🚀 Tip
This generator keeps your utility structure consistent and DRY across your libraries.

# 🛠️ Custom Service Generator - `custom-service`

This generator creates a service class inside a `libs/xxx/src/` folder.

## Usage

```bash
pnpm exec nx g company-generators:custom-service
```
**You will be prompted for:**

- The service name

- The library directory under libs/

✅ It creates a file like:

```
libs/shared/src/my-service.service.ts
```
With content:
```ts
export class MyServiceService {
  constructor() {
    console.log('MyServiceService created!');
  }
}
```
---

## Options

| Option	    | Description	 |
| -------- | ------- |
| `--name`	  | Name of the service |
| `--directory`	 | Target directory inside libs/ |

Example:

```bash
pnpm exec nx g company-generators:custom-service --name=auth --directory=core-utils
```

---


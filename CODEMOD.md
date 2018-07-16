# Index

- [normalize-import-path](#normalize-import-path)
- [shift-imports](#shift-imports)

## Normalize Import Path

Converts relative path of a module reference to a default node_module based path.

**Input:**

```ts
import {a, b, c} from '../../../abc'
```

**Output:**

```ts
import {a, b, c} from 'abc'
```

**Usage:**

```bash
ts-codemod -t normalize-import-path --param.module="abc" **/*.ts
```

| Params   | Type     |                                              |
| -------- | -------- | -------------------------------------------- |
| `module` | `string` | Name of the module, `abc` in the above case. |

## Shift Imports

Migrates imports from one module to another.

**Input:**

```ts
import {a, b, x, xx} from 'ab'
```

**Output:**

```ts
import {a, b} from 'ab'
import {x, xx} from 'x'
```

**Usage:**

```bash
ts-codemod -t shift-imports --param.from 'ab' --param.to: 'x' --param.imports 'x' --param.imports 'xx' **/*.ts
```

| Params    | Type       |                               |
| --------- | ---------- | ----------------------------- |
| `from`    | `string`   | The name of the source module |
| `to`      | `string`   | The name of the target module |
| `imports` | `string[]` | The name of the source module |

# Index

- [normalize-import-path](#normalize-import-path)
- [shift-imports](#shift-imports)
- [array-to-rest-params](#array-to-rest-params)
- [convert-to-call](#convert-to-call)

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

**.tscodemodrc**

```json5
{
  transformation: 'normalize-import-path',
  params: {
    // name of the module
    module: 'abc'
  }
}
```

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

**.tscodemodrc**

```json5
{
  transformation: 'shift-imports',
  params: {
    // name of the source module
    from: 'ab',

    // name of the target module
    to: 'x',

    // all the import specifiers that should be migrated
    imports: ['x', 'xx']
  }
}
```

## Array to Rest Params

Converts a function call that takes an argument of type `Array` into a function call where each element of the array is passed as a separate argument.

**Input:**

```ts
myCustomFunction([1, 2, 3])
```

**Output:**

```ts
myCustomFunction(1, 2, 3)
```

**.tscodemodrc**

```json5
{
  transformation: 'array-to-rest-params',
  params: {
    // name of the function to transform
    functiontransformation: 'myCustomFunction'
  }
}
```

## Convert to Call

Converts a value to a function call.

**Input:**

```ts
const result = abc
```

**Output:**

```ts
const result = abc()
```

**.tscodemodrc**

```json5
{
  transformation: 'convert-to-call',
  params: {
    // name of the identifier
    transformation: 'abc'
  }
}
```

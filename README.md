# ts-codemod

Code-Modifier for Typescript based projects

# Index

- [Installation](#installation)
- [Command Line Usage](#command-line-usage)
- [CLI Arguments](#cli-arguments)
- [Custom Transformation](#custom-transformation)

## Installation

```bash
npm i -g ts-codemod
```

## Command Line Usage

A typical command looks like -

```bash
ts-codemod --write --transformation=[transformation name]  --params.[param name]=[param value] [glob pattern]
```

Say I want to —

```ts
// convert something like —
import * as components from '../../../component'

// to a module path like —
import * as components from 'component'
```

I can use the [normalize-import-path] transformation to achieve this —

```bash
ts-codemod --write --transformation normalize-import-path  --params.moduleName=component src/**/*.ts
```

## CLI Arguments

| **Argument**                         | **Purpose**                             | **Value** |
| ------------------------------------ | --------------------------------------- | --------- |
| `--write` `-w` (_optional_)          | Writes back to the file                 | `false`   |
| `--transformation` `-t` (_required_) | Name of the transformation or file path |           |
| `--params` `-p` ( _optional_)        | Additional transformation specific args |           |

## Custom transformation

A custom transformation (`my-custom-transformation.ts`) can be implemented via extending the `Transformation` class.

```ts
import * as ts from 'typescript'
import {Transformation} from 'ts-codemod'

// my-custom-transformation.ts
export default class MyCustomTransformation extends Transformation {
  apply(node: ts.Node): ts.VisitResult<ts.Node> {
    // write your implementation here
  }
}
```

It can then be executed as —

```bash
ts-codemod -t ./my-custom-transformation.ts src/**.ts
```

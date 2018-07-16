# ts-codemod [![Build Status](https://travis-ci.com/tusharmath/ts-codemod.svg?branch=master)](https://travis-ci.com/tusharmath/ts-codemod)

Code-Modifier for Typescript based projects.

# Index

- [Installation](#installation)
- [Command Line Usage](#command-line-usage)
- [CLI Arguments](#cli-arguments)
- [Builtin Transformations](https://github.com/tusharmath/ts-codemod/blob/master/CODEMOD.md)
- [Custom Transformation](#custom-transformation)
- [Post Transformation](#post-transformation)

## Installation

```bash
npm i -g ts-codemod
```

## Command Line Usage

A typical command looks like -

```bash
ts-codemod --write [glob pattern]
```

So say I want to —

```ts
// convert something like —
import * as components from '../../../component'

// to a module path like —
import * as components from 'component'
```

I can use the [normalize-import-path] transformation to achieve this —

```bash
ts-codemod --transformation normalize-import-path --params.module=component --write src/**/*.ts
```

Transformations in general requires a lot of complicated params and configurations. These configurations can be loaded via a `.tscodemodrc` file —

```json
{
  // name of the transformation
  "transformation": "normalize-import-path",

  // transformation params
  "params": {
    "module": "component"
  }
}
```

```bash
ts-codemod --write src/**/*.ts
```

## CLI Arguments

| **Argument**                         | **Purpose**                             | **Value** |
| ------------------------------------ | --------------------------------------- | --------- |
| `--write` `-w` (_optional_)          | Writes back to the file                 | `false`   |
| `--transformation` `-t` (_required_) | Name of the transformation or file path |           |
| `--params` `-p` ( _optional_)        | Additional transformation specific args |           |

## Custom transformation

Writing a custom transformation isn't very easy and one needs to understand how typescript internally converts plain string to an AST.

A good starter could be to checkout the [transformations] directory. Those transformations are written for a varied level of complexity. Also checkout the [AST Explorer](https://astexplorer.net/) website.

A custom transformation (`my-custom-transformation.ts`) can be implemented via extending the `Transformation` class.

```ts
import * as ts from 'typescript'
import {Transformation} from 'ts-codemod'

// my-custom-transformation.ts
export default class MyCustomTransformation extends Transformation {
  apply(node: ts.Node): ts.VisitResult<ts.Node> {
    // write your implementation here

    return node // will apply no-change
  }
}
```

It can then be executed as —

```bash
ts-codemod -t ./my-custom-transformation.ts src/**.ts
```

## Post Transformation

1.  Life can't be that simple right? Running transformations will generally ruin the formatting of your files. A recommended way to solve that problem is by using [Prettier].
2.  Even after running prettier its possible to have unnecessary new lines added/removed. This can be solved by ignoring white spaces while staging the changes in `git`.

```bash
git diff --ignore-black-lines | git add --cached
```

[prettier]: https://prettier.io

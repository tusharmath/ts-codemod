import * as assert from 'assert'
import ShiftImports from '../transformations/shift-imports'
import {transform, normalize} from '..'

describe('shift-imports', () => {
  it('should migrate imports from one module to another', () => {
    const input = `
    import {a, aa, x, xx} from "a";
    import {b, bb, bbb, bbbb, bbbbb} from "b";
    `
    const expected = normalize(`
    import {a, aa} from "a";
    import {x, xx} from 'x';
    import {b, bb, bbb, bbbb, bbbbb} from "b";
    `)

    const actual = transform({
      transformationCtor: ShiftImports,
      content: input,
      path: './src/file.ts',
      params: {from: 'a', to: 'x', imports: ['x', 'xx']}
    })

    assert.strictEqual(actual, expected)
  })

  it('should skip original module if all imports are shifted', () => {
    const input = `
    import {x, xx} from "a";
    import {b, bb, bbb, bbbb, bbbbb} from "b";
    `
    const expected = normalize(`
    import {x, xx} from 'x';
    import {b, bb, bbb, bbbb, bbbbb} from "b";
    `)

    const actual = transform({
      transformationCtor: ShiftImports,
      content: input,
      path: './src/file.ts',
      params: {from: 'a', to: 'x', imports: ['x', 'xx']}
    })

    assert.strictEqual(actual, expected)
  })
  it('should skip the new module if none of the imports are shifted', () => {
    const input = `
    import {a, aa} from "a";
    import {b, bb, bbb, bbbb, bbbbb} from "b";
    `
    const expected = normalize(`
    import {a, aa} from "a";
    import {b, bb, bbb, bbbb, bbbbb} from "b";
    `)

    const actual = transform({
      transformationCtor: ShiftImports,
      content: input,
      path: './src/file.ts',
      params: {from: 'a', to: 'x', imports: ['x', 'xx']}
    })

    assert.strictEqual(actual, expected)
  })
})

import * as assert from 'assert'
import ReplaceNode from '../transformations/replace-node'
import {transform, normalize} from '..'

describe('replace-node', () => {
  it('should convert node of one type to another', () => {
    const input = normalize(`
      const nil = R.always(Nil())
      export default wonderFull(
        R.always(Nil())
      )
    `)
    const expected = normalize(`
      const nil = Nil
      export default wonderFull(Nil)
    `)

    const actual = transform({
      transformationCtor: ReplaceNode,
      content: input,
      path: './src/file.ts',
      params: {matchWith: 'R.always(Nil())', replaceWith: 'Nil'}
    }).newContent
    assert.strictEqual(actual, expected)
  })

  it('should convert identifiers', () => {
    const input = normalize(`
      import {Hoe} from '@action-land/core'
      export const view = (e: Hoe, m: {}, p: {}) => 'Hello'
    `)
    const expected = normalize(`
    import {Smitten} from '@action-land/core'
    export const view = (e: Smitten, m: {}, p: {}) => 'Hello'
    `)

    const actual = transform({
      transformationCtor: ReplaceNode,
      content: input,
      path: './src/file.ts',
      params: {matchWith: 'Hoe', replaceWith: 'Smitten'}
    }).newContent
    assert.strictEqual(actual, expected)
  })
})

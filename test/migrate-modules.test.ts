import * as assert from 'assert'
import {normalize, transform} from '../index'
import MigrateModules from '../transformations/migrate-modules'

/**
 * Created by tushar on 23/07/18
 */

describe('migrate-modules', () => {
  it('should migrate one module to another', () => {
    const input = normalize(`
    import {a, b, c} from 'abc'
    import * as p from 'p'
    import * as q from 'q'
    import * as r from 'r'
    `)
    const expected = normalize(`
    import {a, b, c} from 'abc-abc'
    import * as p from 'p'
    import * as q from 'qq'
    import * as r from 'r'
    `)

    const actual = transform({
      transformationCtor: MigrateModules,
      content: input,
      path: './src/file.ts',
      params: {modules: {abc: 'abc-abc', q: 'qq'}}
    }).newContent

    assert.strictEqual(actual, expected)
  })
})

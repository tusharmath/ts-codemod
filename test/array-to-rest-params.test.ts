import * as assert from 'assert'
import {normalize, transform} from '..'
import ArrayToRestParams from '../transformations/array-to-rest-params'

describe('array-to-rest-params', () => {
  it('converts a function call from array to rest param', () => {
    const input = `
    const result = myCustomFunction([1, 2, 3]);
    `
    const expected = normalize(`
    const result = myCustomFunction(1, 2, 3);
    `)

    const actual = transform({
      transformationCtor: ArrayToRestParams,
      content: input,
      path: './src/file.ts',
      params: {functionName: 'myCustomFunction'}
    }).newContent

    assert.strictEqual(actual, expected)
  })
})

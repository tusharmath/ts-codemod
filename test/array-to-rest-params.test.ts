import * as assert from 'assert'
import ArrayToRestParams from '../transformations/array-to-rest-params'
import {transform, normalize} from '..'

describe.only('array-to-rest-params', () => {
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
    })

    assert.strictEqual(actual, expected)
  })
})

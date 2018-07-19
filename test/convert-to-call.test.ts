import * as assert from 'assert'
import ConvertToCall from '../transformations/convert-to-call'
import {transform, normalize} from '..'

describe('convert-to-call', () => {
  it('should convert arg to a function call', () => {
    const input = `
    const result = functionCall(youGottaChangeMe)
    `
    const expected = normalize(`
    const result = functionCall(youGottaChangeMe())
    `)

    const actual = transform({
      transformationCtor: ConvertToCall,
      content: input,
      path: './src/file.ts',
      params: {name: 'youGottaChangeMe'}
    })

    assert.strictEqual(actual, expected)
  })

  it('should convert values to function call', () => {
    const input = `
    const result = youGottaChangeMe
    `
    const expected = normalize(`
    const result = youGottaChangeMe()
    `)

    const actual = transform({
      transformationCtor: ConvertToCall,
      content: input,
      path: './src/file.ts',
      params: {name: 'youGottaChangeMe'}
    })

    assert.strictEqual(actual, expected)
  })
})

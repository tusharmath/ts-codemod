import * as assert from 'assert'
import NormalizeImportPath from '../transformations/normalize-import-path'
import {transform, normalize} from '..'

describe('normalize-import-path', () => {
  it('should convert relative path to module path', () => {
    const input = `
    import * as components from "../../../components";
    import {B} from "../b";
    `
    const expected = normalize(`
    import * as components from "components";
    import {B} from "../b";
    `)

    const actual = transform({
      transformationCtor: NormalizeImportPath,
      content: input,
      path: './src/file.ts',
      params: {module: 'components'}
    })

    assert.strictEqual(actual, expected)
  })
})

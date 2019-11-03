import * as assert from 'assert'
import {normalize, transform} from '../..'
import NormalizeImportPath from '../../transformations/normalize-import-path'

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
    }).newContent

    assert.strictEqual(actual, expected)
  })
})

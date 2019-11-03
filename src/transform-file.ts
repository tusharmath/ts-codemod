/**
 * Created by tushar on 01/06/18
 */
import * as fs from 'fs-extra'
import {transform, TransformationCtor} from './transform'
const debug = require('debug')('ts-codemod')

export interface ICodeModParams<Params> {
  path: string
  write?: boolean
  transformationCtor: TransformationCtor<Params>
  params: Params
}

export async function transformFile<Params>(
  o: ICodeModParams<Params>
): Promise<{path: string; written: boolean; content: string}> {
  let written = false
  const content = (await fs.readFile(o.path)).toString()
  debug('ORIGINAL FILE\n', content)
  const {newContent, oldContent} = transform<Params>({
    content,
    params: o.params,
    path: o.path,
    transformationCtor: o.transformationCtor
  })

  debug('NEW FILE\n', newContent)
  if (o.write && oldContent !== newContent) {
    await fs.writeFile(o.path, newContent)
    written = true
  }
  return {
    path: o.path,
    content: newContent,
    written
  }
}

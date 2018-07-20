/**
 * Created by tushar on 01/06/18
 */
import * as fs from 'fs-extra'
import {TransformationCtor, transform} from './transform'

const DEFAULT_PARAMS = {
  write: false
}

export type CodeModParams<Params> = {
  path: string
  write?: boolean
  transformationCtor: TransformationCtor<Params>
  params: Params
}

export async function transformFile<Params>(o: CodeModParams<Params>) {
  let written = false
  const content = (await fs.readFile(o.path)).toString()
  const {newContent, oldContent} = transform<Params>({
    content,
    params: o.params,
    path: o.path,
    transformationCtor: o.transformationCtor
  })
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

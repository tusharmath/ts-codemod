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
  const content = (await fs.readFile(o.path)).toString()
  const newContent = transform<Params>({
    content,
    params: o.params,
    path: o.path,
    transformationCtor: o.transformationCtor
  })
  if (o.write) await fs.writeFile(o.path, newContent)
  return {
    path: o.path,
    content: newContent
  }
}

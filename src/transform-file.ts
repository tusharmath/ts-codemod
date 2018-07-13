/**
 * Created by tushar on 01/06/18
 */
import * as fs from 'fs-extra'
import {CodeTransformerCtor, transform} from './transform'

const DEFAULT_PARAMS = {
  write: false
}

export type CodeModParams = {
  path: string
  write?: boolean
}

export async function transformFile<Params>(
  transformer: CodeTransformerCtor<Params>,
  nParams: CodeModParams,
  transformationParams: Params
) {
  const params = Object.assign({}, DEFAULT_PARAMS, nParams)
  const content = (await fs.readFile(params.path)).toString()
  const newContent = transform<Params>(
    transformer,
    {path: params.path, content},
    transformationParams
  )
  if (params.write) await fs.writeFile(params.path, newContent)
  return {
    path: params.path,
    content: newContent
  }
}

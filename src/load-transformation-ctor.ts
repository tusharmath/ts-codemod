import * as path from 'path'
import {TransformationCtor} from './transform'
const debug = require('debug')('ts-codemod')

/**
 * Dynamically decides which transformation to load.
 * if the transformation name ends with .ts its directly loaded,
 * otherwise transformations are loaded from the transformation dir
 */
export const loadTransformationCtor = <T>(
  name: string
): TransformationCtor<T> => {
  const transformerPath = name.match(/\.ts$/)
    ? path.resolve(process.cwd(), name)
    : path.resolve(__dirname, '../transformations', name)
  debug(`TRANSFORMER_PATH: ${transformerPath}`)
  return require(transformerPath).default
}

import * as path from 'path'
import {TransformationCtor} from './transform'

/**
 * Dynamically decides which transformation to load.
 * if the transformation name ends with .ts its directly loaded,
 * otherwise transformations are loaded from the transformation dir
 */
export const loadTransformationCtor = (name: string): TransformationCtor => {
  return name.match(/\.ts$/)
    ? require(path.resolve(process.cwd(), name))
    : require(path.resolve(__dirname, '../transformations', name))
}

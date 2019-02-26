import * as path from 'path'
import {TransformationCtor} from './transform'

/**
 * Dynamically decides which transformation to load.
 * if the transformation name ends with .ts its directly loaded,
 * otherwise transformations are loaded from the transformation dir
 */
export const loadTransformationCtor = <T>(
  name: string
): TransformationCtor<T> => {
  return name.match(/\.ts$/)
    ? require(path.resolve(process.cwd(), name)).default
    : require(path.resolve(__dirname, '../transformations', name)).default
}

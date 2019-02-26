import {curry2} from 'ts-curry'
import * as ts from 'typescript'
import {Transformation} from '..'
import {SCRIPT_TARGET} from './script-target'
const debug = require('debug')('ts-codemod')

export type TransformationCtor<Params = {}> = new (
  path: string,
  ctx: ts.TransformationContext,
  params: Params
) => Transformation<Params>

export interface ITransformOptions<Params> {
  content: string
  path: string
  transformationCtor: TransformationCtor<Params>
  params: Params
}

export interface ITransformationResult {
  newContent: string
  oldContent: string
  sourceFile: ts.SourceFile
}

/**
 * Takes in a transformer + content and path and return a new content
 */
export function transform<Params>(
  o: ITransformOptions<Params>
): ITransformationResult {
  const sourceFile = ts.createSourceFile(o.path, o.content, SCRIPT_TARGET, true)

  const transformed = ts.transform(sourceFile, [
    curry2((context: ts.TransformationContext, file: ts.SourceFile) => {
      const transformer = new o.transformationCtor(o.path, context, o.params)
      transformer.before()
      debug(`PARAMS:`, o.params)
      debug(`FILE: ${o.path}`)
      const transformedFile = transformer.forEach(file) as ts.SourceFile

      transformer.after()
      return transformedFile
    })
  ])
  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed})
  const newContent = printer.printBundle(
    ts.createBundle(transformed.transformed)
  )

  const oldContent = ts.createPrinter().printFile(sourceFile)
  transformed.dispose()
  return {newContent, oldContent, sourceFile}
}

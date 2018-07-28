import * as ts from 'typescript'
import {curry2} from 'ts-curry'
import {SCRIPT_TARGET} from './script-target'
import {Transformation} from '..'
const debug = require('debug')('ts-codemod')

export interface TransformationCtor<Params = {}> {
  new (
    path: string,
    ctx: ts.TransformationContext,
    params: Params
  ): Transformation<Params>
}

export interface TransformOptions<Params> {
  content: string
  path: string
  transformationCtor: TransformationCtor<Params>
  params: Params
}

export interface TransformationResult {
  newContent: string
  oldContent: string
  sourceFile: ts.SourceFile
}

/**
 * Takes in a transformer + content and path and return a new content
 */
export function transform<Params>(
  o: TransformOptions<Params>
): TransformationResult {
  const sourceFile = ts.createSourceFile(o.path, o.content, SCRIPT_TARGET, true)

  const transformed = ts.transform(sourceFile, [
    curry2((context: ts.TransformationContext, file: ts.SourceFile) => {
      const transformer = new o.transformationCtor(o.path, context, o.params)
      debug(`PARAMS:`, o.params)
      debug(`FILE: ${o.path}`)
      return transformer.forEach(file) as ts.SourceFile
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

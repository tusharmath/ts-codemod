import * as ts from 'typescript'
import {curry2} from 'ts-curry'
import {SCRIPT_TARGET} from './script-target'
const debug = require('debug')('ts-codemod')

export abstract class Transformation<T = {}> {
  constructor(
    readonly path: string,
    readonly ctx: ts.TransformationContext,
    readonly params: T
  ) {}

  abstract visit(node: ts.Node): ts.VisitResult<ts.Node>

  forEach = (input: ts.Node): ts.VisitResult<ts.Node> => {
    const node = this.visit(input)
    return node instanceof Array
      ? node.map(_ => ts.visitEachChild(_, this.forEach, this.ctx))
      : ts.visitEachChild(node, this.forEach, this.ctx)
  }
}

export type TransformationCtor<Params = {}> = {
  new (
    path: string,
    ctx: ts.TransformationContext,
    params: Params
  ): Transformation<Params>
}

export type TransformOptions<Params> = {
  content: string
  path: string
  transformationCtor: TransformationCtor<Params>
  params: Params
}

export type TransformationResult = {
  newContent: string
  oldContent: string
  sourceFile: ts.SourceFile
}

/**
 * Takes in a transformer + content and path and return a new content
 */
export const transform = <Params>(
  o: TransformOptions<Params>
): TransformationResult => {
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

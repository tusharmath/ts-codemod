import * as ts from 'typescript'
import {forEachNode} from './for-each-node'
const debug = require('debug')('ts-codemod')

export abstract class Transformation<T = {}> {
  constructor(
    readonly path: string,
    readonly ctx: ts.TransformationContext,
    readonly params: T
  ) {}

  abstract visit(node: ts.Node): ts.VisitResult<ts.Node>
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

/**
 * Takes in a transformer + content and path and return a new content
 */
export const transform = <Params>(o: TransformOptions<Params>) => {
  const sourceFile = ts.createSourceFile(
    o.path,
    o.content,
    ts.ScriptTarget.ES2017,
    true
  )

  const transformed = ts.transform(sourceFile, [
    (context: ts.TransformationContext) => (file: ts.SourceFile) => {
      const transformer = new o.transformationCtor(o.path, context, o.params)
      debug(`PARAMS:`, o.params)
      const visitor: ts.Visitor = (node: ts.Node) => {
        const visitResult = transformer.visit(node)
        return visitResult ? forEachNode(visitor, visitResult, context) : node
      }
      debug(`FILE: ${o.path}`)
      return ts.visitEachChild(
        transformer.visit(file) as ts.SourceFile,
        visitor,
        context
      )
    }
  ])
  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed})
  const newContent = printer.printBundle(
    ts.createBundle(transformed.transformed)
  )
  transformed.dispose()
  return newContent
}

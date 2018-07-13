import * as ts from 'typescript'
import {forEachNode} from './for-each-node'

export abstract class Transformation<T> {
  constructor(
    readonly path: string,
    readonly ctx: ts.TransformationContext,
    readonly params: T
  ) {}

  abstract visit(node: ts.Node): ts.VisitResult<ts.Node>
}

export type TransformationCtor<Params> = {
  new (
    path: string,
    ctx: ts.TransformationContext,
    params: Params
  ): Transformation<Params>
}

/**
 * Takes in a transformer + content and path and return a new content
 */
export const transform = <T>(
  transformerCtor: TransformationCtor<T>,
  params: {content: string; path: string},
  transformationParams: T
) => {
  const sourceFile = ts.createSourceFile(
    params.path,
    params.content,
    ts.ScriptTarget.ES2017,
    true
  )

  const transformed = ts.transform(sourceFile, [
    (context: ts.TransformationContext) => (file: ts.SourceFile) => {
      const transformer = new transformerCtor(
        params.path,
        context,
        transformationParams
      )
      const visitor: ts.Visitor = (node: ts.Node) => {
        const visitResult = transformer.visit(node)
        return visitResult ? forEachNode(visitor, visitResult, context) : node
      }
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

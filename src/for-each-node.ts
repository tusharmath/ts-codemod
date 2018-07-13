/**
 * Created by tushar on 30/06/18
 */

import * as ts from 'typescript'

/**
 * Performs a DFS on the AST
 * @param iterator
 * @param node
 * @param context
 */
export const forEachNode = (
  iterator: ts.Visitor,
  node: ts.VisitResult<ts.Node>,
  context: ts.TransformationContext
): ts.VisitResult<ts.Node> =>
  node instanceof Array
    ? node.map(_ => ts.visitEachChild(_, iterator, context))
    : ts.visitEachChild(node, iterator, context)

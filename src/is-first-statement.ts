/**
 * Created by tushar on 30/06/18
 */

import * as ts from 'typescript'

/**
 * Detects if the node is the first node in the file
 * @param node
 */
export function isFirstStatement(node: ts.Node) {
  return (
    node.parent &&
    ts.isSourceFile(node.parent) &&
    node.parent.statements.indexOf(node as ts.Statement) === 0
  )
}

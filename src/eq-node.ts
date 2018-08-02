import * as ts from 'typescript'
const debug = require('debug')('ts-codemod:eq')
export function eqNode(a: ts.Node, b: ts.Node): boolean {
  return strictlyEq(a, b) || eqIdentifier(a, b) || eqChildren(a, b)
}

function eqChildren(a: ts.Node, b: ts.Node): boolean {
  /**
   * Children comparison should happen only for nodes that are
   * not of type Identifier
   */
  if (eqKind(a, b) && !ts.isIdentifier(a)) {
    const result = a
      .getChildren()
      .every((aChild, id) => eqNode(b.getChildAt(id), aChild))
    if (result)
      debug('children:', `'${a.getFullText()}'`, `'${b.getFullText()}'`)
    return result
  }
  return false
}

function eqKind(a: ts.Node, b: ts.Node) {
  const result = a.kind === b.kind
  if (result) debug('kind:', `'${a.getFullText()}'`, `'${b.getFullText()}'`)
  if (result) return result
}

function eqIdentifier(a: ts.Node, b: ts.Node): boolean {
  const result = ts.isIdentifier(a) && ts.isIdentifier(b) && a.text === b.text
  if (result)
    debug('identifier:', `'${a.getFullText()}'`, `'${b.getFullText()}'`)
  return result
}

function strictlyEq(a: ts.Node, b: ts.Node) {
  return a === b
}

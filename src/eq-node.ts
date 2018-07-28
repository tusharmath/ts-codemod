import * as ts from 'typescript'

export function eqNode(a: ts.Node, b: ts.Node): boolean {
  return (
    strictlyEq(a, b) || eqIdentifier(a, b) || (eqKind(a, b) && eqChildren(a, b))
  )
}

function eqChildren(a: ts.Node, b: ts.Node): boolean {
  return a.getChildren().every((aChild, id) => eqNode(b.getChildAt(id), aChild))
}

function eqKind(a: ts.Node, b: ts.Node) {
  return a.kind === b.kind
}

function eqIdentifier(a: ts.Node, b: ts.Node): boolean {
  return ts.isIdentifier(a) && ts.isIdentifier(b) && a.text === b.text
}

function strictlyEq(a: ts.Node, b: ts.Node) {
  return a === b
}

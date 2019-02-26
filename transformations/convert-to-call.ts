import * as ts from 'typescript'
import {Transformation} from '..'

/**
 * Converts a value usage to a function call
 */
export default class ConvertToCall extends Transformation<{
  name: string
}> {
  public visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (
      // check if its an identifier and not string/text
      ts.isIdentifier(node) &&
      // check if the identifier matches the param
      node.text === this.params.name &&
      // special check for import specifiers
      (node.parent && !ts.isImportSpecifier(node.parent))
    ) {
      return ts.createCall(ts.createIdentifier(this.params.name), undefined, [])
    }

    return node
  }
}

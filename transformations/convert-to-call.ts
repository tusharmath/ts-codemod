import {Transformation} from '..'
import * as ts from 'typescript'

/**
 * Converts a value usage to a function call
 */
export default class ConvertToCall extends Transformation<{
  name: string
}> {
  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (
      ts.isIdentifier(node) &&
      node.text === this.params.name &&
      /**
       * This check makes sure that the iteration happen only till one level.
       * A node that has not yet been attached will have parent set to undefined
       */
      node.parent
    ) {
      return ts.createCall(ts.createIdentifier(this.params.name), undefined, [])
    }
    return node
  }
}

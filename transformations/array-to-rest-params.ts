import * as ts from 'typescript'
import {Transformation} from '..'

export default class ArrayToRestParams extends Transformation<{
  functionName: string
}> {
  public visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.escapedText === this.params.functionName &&
      node.arguments.length > 0 &&
      ts.isArrayLiteralExpression(node.arguments[0])
    ) {
      // get all the arguments
      const args = node.arguments[0] as ts.ArrayLiteralExpression

      // create a new function call
      return ts.createCall(
        ts.createIdentifier(this.params.functionName),
        undefined,
        args.elements
      )
    }
    return node
  }
}

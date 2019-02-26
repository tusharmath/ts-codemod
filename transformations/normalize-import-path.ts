import * as ts from 'typescript'
import {Transformation} from '..'

export default class extends Transformation<{module: string}> {
  public visit(node: ts.Node): ts.VisitResult<ts.Node> {
    return ts.isImportDeclaration(node) &&
      node.moduleSpecifier.getText().match(this.params.module)
      ? ts.createImportDeclaration(
          node.decorators,
          node.modifiers,
          node.importClause,
          ts.createLiteral(this.params.module)
        )
      : node
  }
}

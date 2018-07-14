import {Transformation} from '..'
import * as ts from 'typescript'
const debug = require('debug')('ts-codemod:shift-imports')

export default class extends Transformation<{
  from: string
  to: string
  imports: string[]
}> {
  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (
      /**
       * Check if its an import dec
       */

      ts.isImportDeclaration(node) &&
      /**
       * check if import is for the module in test
       */

      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === this.params.from &&
      (debug(`MODULE: ${node.moduleSpecifier.text}`) || 1) &&
      node.importClause &&
      (debug(`HAS: node.importClause`) || 1) &&
      node.importClause.namedBindings &&
      /**
       * Check if import is of type —  import {a, b, c} from 'abc';
       */
      ts.isNamedImports(node.importClause.namedBindings)
    ) {
      debug(`CREATE IMPORT`)
      /**
       * Get the import literals — a, b, c part from above
       */
      const importLiterals = node.importClause.namedBindings.elements.map(_ =>
        _.name.getText()
      )

      debug(`ORIGINAL: ${importLiterals}`)

      /**
       * Get original specifiers
       */
      const keep = importLiterals.filter(
        _ => this.params.imports.indexOf(_) === -1
      )
      debug(`KEEP: ${keep}`)

      /**
       * Get original specifiers
       */
      const remove = importLiterals.filter(
        _ => this.params.imports.indexOf(_) > -1
      )
      debug(`REMOVE: ${remove}`)

      return [
        this._createImportDeclaration(this.params.from, keep),
        this._createImportDeclaration(this.params.to, remove)
      ]
    }
    return node
  }

  /**
   * Creates a new import declaration
   */
  private _createImportDeclaration(module: string, keep: string[]): ts.Node {
    const importClause = ts.createImportClause(
      undefined,
      ts.createNamedImports(
        keep.map(_ =>
          ts.createImportSpecifier(undefined, ts.createIdentifier(_))
        )
      )
    )
    return keep.length > 0
      ? ts.createImportDeclaration(
          [],
          [],
          importClause,
          ts.createLiteral(module)
        )
      : ts.createIdentifier('')
  }
}

import {Transformation} from '..'
import * as ts from 'typescript'

export default class ReplaceNode extends Transformation<{
  matchWith: string
  replaceWith: string
}> {
  private matchWith: ts.Node = ts.createEmptyStatement()
  private replaceWith: ts.Node = ts.createEmptyStatement()

  init() {
    this.matchWith = this.toNode(this.params.matchWith)
    this.replaceWith = this.toNode(this.params.replaceWith)
  }

  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    return this.equal(node, this.matchWith) ? this.replaceWith : node
  }
}

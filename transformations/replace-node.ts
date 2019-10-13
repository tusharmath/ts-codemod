import * as ts from 'typescript'
import {Transformation} from '..'
const debug = require('debug')('ts-codemod:replace-node')

const cName = (obj: object) => obj.constructor.name.replace('Object', '')

export default class ReplaceNode extends Transformation<{
  matchWith: string
  replaceWith: string
}> {
  private matchWith: ts.Node = ts.createEmptyStatement()
  private replaceWith: ts.Node = ts.createEmptyStatement()

  public before(): void {
    const {matchWith, replaceWith} = this.params
    this.matchWith = this.toNode(matchWith)
    this.replaceWith = this.toNode(replaceWith)
    debug('matchWith:', cName(this.matchWith), `'${matchWith}'`)
    debug('replaceWith:', cName(this.replaceWith), `'${replaceWith}'`)
  }

  public visit(node: ts.Node): ts.VisitResult<ts.Node> {
    debug('node:', cName(node), `'${node.getFullText()}'`)
    if (this.equal(node, this.matchWith)) {
      debug(
        'replacing',
        node.getFullText(),
        'with',
        this.replaceWith.getFullText()
      )
      return this.replaceWith
    }
    return node
  }
}

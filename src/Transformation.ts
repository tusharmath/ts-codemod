import * as ts from 'typescript'
import {eqNode} from './eq-node'
import {SCRIPT_TARGET} from './script-target'
const debug = require('debug')('ts-codemod')

export abstract class Transformation<T = {}> {
  constructor(
    readonly path: string,
    readonly ctx: ts.TransformationContext,
    readonly params: T
  ) {
    debug('TRANSFORMATION CREATED', path)
  }

  public before(): void {}

  public after(): void {}

  public abstract visit(node: ts.Node): ts.VisitResult<ts.Node>

  public forEach = (input: ts.Node): ts.VisitResult<ts.Node> => {
    const node = this.visit(input)

    if (node === input) {
      return node instanceof Array
        ? node.map(_ => ts.visitEachChild(_, this.forEach, this.ctx))
        : ts.visitEachChild(node, this.forEach, this.ctx)
    }

    return node
  }

  public toNode(template: string): ts.Node {
    const statement = ts.createSourceFile(
      '<unknown>',
      template,
      SCRIPT_TARGET,
      true
    ).statements[0] as ts.ExpressionStatement
    return statement.expression
  }

  public equal(a: ts.Node, b: ts.Node): boolean {
    return eqNode(a, b)
  }
}

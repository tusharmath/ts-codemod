import * as ts from 'typescript'
import {SCRIPT_TARGET} from './script-target'
import {eqNode} from './eq-node'

export abstract class Transformation<T = {}> {
  constructor(
    readonly path: string,
    readonly ctx: ts.TransformationContext,
    readonly params: T
  ) {}

  init() {}

  abstract visit(node: ts.Node): ts.VisitResult<ts.Node>

  forEach = (input: ts.Node): ts.VisitResult<ts.Node> => {
    const node = this.visit(input)
    return node instanceof Array
      ? node.map(_ => ts.visitEachChild(_, this.forEach, this.ctx))
      : ts.visitEachChild(node, this.forEach, this.ctx)
  }

  toNode(template: string): ts.Node {
    const statement = ts.createSourceFile(
      '<unknown>',
      template,
      SCRIPT_TARGET,
      true
    ).statements[0] as ts.ExpressionStatement
    return statement.expression
  }

  equal(a: ts.Node, b: ts.Node): boolean {
    return eqNode(a, b)
  }
}

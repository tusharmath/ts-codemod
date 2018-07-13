import * as ts from 'typescript'
import {Transformation} from '../src/transform'

export default class extends Transformation<{module: string}> {
  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    throw new Error('Method not implemented.')
  }
}

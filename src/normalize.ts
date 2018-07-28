import * as ts from 'typescript'
import {SCRIPT_TARGET} from './script-target'

export const normalize = (content: string) => {
  const sourceFile = ts.createSourceFile('', content, SCRIPT_TARGET)
  return ts.createPrinter().printFile(sourceFile)
}

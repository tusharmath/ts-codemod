import * as ts from 'typescript'

export const normalize = (content: string) => {
  const sourceFile = ts.createSourceFile('', content, ts.ScriptTarget.ES2016)
  return ts.createPrinter().printFile(sourceFile)
}

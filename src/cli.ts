import chalk from 'chalk'
import * as path from 'path'
import * as yargs from 'yargs'
import {transformFile} from './transform-file'

const LOG = console.log

const {transformation, write, _: sourceFiles, param} = yargs
  .usage('Usage: $0 -t [transformation-name] [glob pattern]')
  .option('write', {
    alias: 'w',
    describe: 'Write the updated file to disk'
  })
  .option('transformation', {
    alias: 't',
    describe: 'The name of the transformation',
    demandOption: true
  })
  .option('param', {
    alias: 'p',
    describe: 'Transformation specific params'
  })
  .boolean('w')
  .string('t').argv

async function main() {
  const transformationPath = transformation.match(/\.ts$/)
    ? path.resolve(process.cwd(), transformation)
    : path.resolve(__dirname, '../transformations', transformation)
  const {default: transformationFunction} = await import(transformationPath)

  const createSourceFile = async (path: string) => {
    const {content} = await transformFile(
      transformationFunction,
      {write, path},
      param
    )
    LOG(chalk.green(path))
    if (!write) LOG(chalk.white(content))
  }
  return Promise.all(sourceFiles.map(createSourceFile))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

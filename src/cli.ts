import chalk from 'chalk'
import * as path from 'path'
import * as yargs from 'yargs'
import * as R from 'ramda'
import {transformFile} from './transform-file'

const LOG = console.log

const {transformation, write, _: sourceFiles} = yargs
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
  .boolean('w')
  .string('t').argv

async function main() {
  const {default: transformationFunction} = await import(path.resolve(
    process.cwd(),
    transformation
  ))

  const createSourceFile = async (path: string) => {
    const params = {write, path}
    const {content} = await transformFile(
      transformationFunction,
      params,
      yargs.argv
    )
    LOG(chalk.green(path))
    if (!write) LOG(chalk.white(content))
  }
  return Promise.all(sourceFiles.map(createSourceFile))
}

main().catch(err => {
  LOG(chalk.red(err))
  process.exit(1)
})

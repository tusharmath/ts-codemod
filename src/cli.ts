import chalk from 'chalk'
import * as path from 'path'
import * as yargs from 'yargs'
import {transformFile} from './transform-file'
import * as fs from 'fs-extra'
import * as R from 'ramda'
import {loadTransformationCtor} from './load-transformation-ctor'

const LOG = console.log

type TSCodemodRC<Params = {}> = {
  pattern: string
  transformation: string
  params: Params
}

// parse CLI args
const {write, _: sourceFiles, transformation, params} = yargs
  .usage('Usage: $0 [file pattern]')
  .option('write', {
    alias: 'w',
    type: 'boolean',
    describe: 'Write the updated file to disk'
  })
  .option('transformation', {
    alias: 't',
    type: 'string',
    describe: 'Path or name of the transformation'
  })
  .option('params', {
    alias: 'p',
    describe: 'Custom params to the transformation'
  })
  .help().argv

async function main() {
  // read the config file
  const config: TSCodemodRC = R.merge(
    await fs
      .readJSON(path.resolve(process.cwd(), '.tscodemodrc'))
      .catch(() => ({})),
    R.reject(R.isNil, {transformation, params})
  )

  LOG(
    chalk.blue(`\n${chalk.bold('Transformation:')} ${config.transformation}\n`)
  )

  // dynamically decide between built-in vs custom transformation
  const transformationCtor = loadTransformationCtor(config.transformation)

  const createSourceFile = async (path: string) => {
    const {content, written} = await transformFile({
      transformationCtor: transformationCtor,
      write,
      path,
      params: config.params
    })
    if (written) LOG(chalk.green(path))
    if (!write) LOG(chalk.white(content))
  }
  return Promise.all(sourceFiles.map(createSourceFile))
}

main().catch(err => {
  console.log(err)
  process.exit(1)
})

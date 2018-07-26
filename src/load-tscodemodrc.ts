/**
 * Created by tushar on 26/07/18
 */

import * as path from 'path'
import * as fs from 'fs-extra'
import * as json5 from 'json5'

export type TSCodemodRC<Params = {}> = {
  pattern: string
  transformation: string
  params: Params
}

const FILE_NAME = '.tscodemodrc'
export const loadRCFile = <T>(): Promise<TSCodemodRC<T>> =>
  fs
    .readFile(path.resolve(process.cwd(), FILE_NAME), 'utf-8')
    .then(json5.parse)
    .catch((err: any) => (err.code === 'ENOENT' ? {} : Promise.reject(err)))

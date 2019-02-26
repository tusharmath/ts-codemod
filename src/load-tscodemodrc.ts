/**
 * Created by tushar on 26/07/18
 */

import * as fs from 'fs-extra'
import * as json5 from 'json5'
import * as path from 'path'

export interface ITSCodemodRC<Params = {}> {
  pattern: string
  transformation: string
  params: Params
}

const FILE_NAME = '.tscodemodrc'
export const loadRCFile = <T>(): Promise<ITSCodemodRC<T>> =>
  fs
    .readFile(path.resolve(process.cwd(), FILE_NAME), 'utf-8')
    .then(json5.parse)
    .catch(err => (err.code === 'ENOENT' ? {} : Promise.reject(err)))

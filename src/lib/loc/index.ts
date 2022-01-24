/* eslint-disable no-await-in-loop */
import { createReadStream, lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import { ask } from '../utils'
import { Args, Count } from './interfaces'

export default async function loc(args: Args): Promise<Count> {
  const count = { c: 0 }
  await readDir(args.cwd, count)

  return count
}

export async function readDir(dir: string, count: Count) {
  for (const entry of readdirSync(dir, { encoding: 'utf-8' })) {
    console.log('Current path:', entry)
    const a = await ask('loc>')
    if (a === 's' || a === 'skip' || a === 'i' || a === 'ignore')
      continue

    const path = join(dir, entry)
    const stat = lstatSync(path)

    if (stat.isDirectory()) { await readDir(path, count) }
    else if (stat.isFile()) { await countLines(path, count) }
  }
}

export async function countLines(path: string, count: Count) {
  return new Promise<void>((resolve) => {
    createReadStream(path)
      .on('data', (chunk) => {
        for (let i = 0; i < chunk.length; ++i)
          if (chunk[i] == 10) count.c++;
      })
      .on('end', () => resolve())
  })
}

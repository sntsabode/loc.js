/* eslint-disable no-await-in-loop */
import { createReadStream, lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import { ask } from '../utils'
import { Args, Count } from './interfaces'

export default async function loc(args: Args): Promise<Count> {
  const count = { c: 0 }
  await readDir(args.cwd, count, args)

  return count
}

export async function readDir(dir: string, count: Count, args: Args) {
  for (const entry of readdirSync(dir, { encoding: 'utf-8' })) {
    const path = join(dir, entry)
    if (!checkEntry(path, args)) { continue }
    const stat = lstatSync(path)
    const [emoji, val] = stat.isDirectory() ? ['📂', 'directory'] : ['📝', 'file']

    console.log(`${emoji} Current ${val}:`, path)

    if (!args.yes) {
      const a = await ask('loc>')
      if (a === 's' || a === 'skip' || a === 'i' || a === 'ignore')
        continue
    }

    if (stat.isDirectory()) { await readDir(path, count, args) }
    else if (stat.isFile()) { await countLines(path, count) }
  }
}

export function checkEntry(fullPath: string, args: Args): boolean {
  if (!args.paths) { return true }

  const i = args.paths.findIndex(p => fullPath.startsWith(p))
  if (i === -1) { return false }

  return true
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

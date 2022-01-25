/* eslint-disable no-await-in-loop */
import { createReadStream, lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import { ask } from '../utils'
import { Args, Count } from './interfaces'

export default class loc {
  private args: Args
  private count: Count = { c: 0 }

  constructor(args: Args) {
    this.args = args
  }

  async main(): Promise<Count> {
    await this.readDir(this.args.cwd)
    return this.count
  }

  private async readDir(dir: string) {
    for (const entry of readdirSync(dir, { encoding: 'utf-8' })) {
      const path = join(dir, entry)
      if (!this.checkEntry(path)) { continue }
      const stat = lstatSync(path)

      const [emoji, val] = stat.isDirectory() ? ['📂', 'directory'] : ['📝', 'file']
      console.log(`${emoji} Current ${val}:`, path)

      if (!this.args.yes) {
        const a = await ask('loc>')
        if (a === 's' || a === 'skip' || a === 'i' || a === 'ignore')
          continue
      }

      if (stat.isDirectory()) { await this.readDir(path) }
      else if (stat.isFile()) { await this.countLines(path) }
    }
  }

  private checkEntry(path: string): boolean {
    if (!this.args.paths) { return true }

    const i = this.args.paths.findIndex(p => path.startsWith(p))
    if (i === -1) { return false }

    return true
  }

  private async countLines(path: string) {
    return new Promise<void>((resolve) => {
      createReadStream(path)
        .on('data', (chunk) => {
          for (let i = 0; i < chunk.length; ++i)
            if (chunk[i] == 10) this.count.c++;
        })
        .on('end', () => resolve())
    })
  }
}

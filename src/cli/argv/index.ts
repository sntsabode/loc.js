import { sep } from 'path'
import { Argv } from './interfaces'
import ArgParser from './parser'

const fetch_argv = (
  argv?: string[]
) => new ArgParser<Argv>(argv)
  .arg('yes', {
    alias: 'y',
    type: 'boolean',
    describe: 'Do not ask any questions.'
  })
  .arg('paths', {
    alias: 'p',
    type: 'array',
    describe: 'Enter a path loc should work in, relative to the current directory.',
    sanitizer: (p, sup) => {
      if (p.endsWith('/')) {
        p = p.substring(0, p.length - 1)
      }

      return p.substring(0, 2) === './'
        ? sup.staged_args.cwd + sep + p.substring(2)
        : sup.staged_args.cwd + sep + p
    }
  })
  .arg('log', {
    alias: 'l',
    type: 'string',
    describe: 'Whether or not the process should log.',
    choices: ['y', 'n']
  })
  .insert('cwd', process.cwd())
  .argv

export default fetch_argv

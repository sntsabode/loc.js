import { Argv } from './interfaces'
import ArgParser from './parser'

const fetch_argv = () => new ArgParser<Argv>()
  .arg('yes', {
    alias: 'y',
    type: 'boolean',
    describe: 'Do not ask any questions.'
  })
  .arg('paths', {
    alias: 'p',
    type: 'array',
    describe: 'Enter a path loc should work in, relative to the current directory.',
    sanitizer: (p, sup) => p.substring(0, 2) === './'
      ? sup.staged_args.cwd + '/' + p.substring(2)
      : sup.staged_args.cwd + '/' + p
  })
  .insert('cwd', process.cwd())
  .argv

export default fetch_argv

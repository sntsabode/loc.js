import { join } from 'path'
import { unsafe } from '../../lib/utils'
import { Argv } from './interfaces'
import ArgParser from './parser'

export default function fetch_argv() {
  const argv = new ArgParser<Argv>()
    .arg('yes', {
      alias: 'y',
      type: 'boolean',
      describe: 'Do not ask any questions.'
    })
    .arg('path', {
      alias: 'p',
      type: 'string',
      describe: 'Enter a path loc should work in, relative to the current directory.'
    })
    .argv

  processPathArg(argv)

  return argv
}

function processPathArg(argv: Argv) {
  (argv as unsafe).cwd = argv.path
    ? join(process.cwd(), argv.path.startsWith('./')
        ? argv.path.substring(2)
        : argv.path
      )
    : process.cwd()
}

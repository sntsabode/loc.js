import { Argv } from './argv/interfaces'
import fetch_argv from './argv'
import loc from '../lib/loc'

let args: Argv
try {
  args = fetch_argv()
} catch (e: unknown) {
  console.error((e as { message: string }).message ?? e)
  process.exit(1)
}

new loc(args).main().then(
  ({ c }) => console.log(c, 'lines counted.'),
  (e) => console.error(e.message ?? e)
)

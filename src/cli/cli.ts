import loc from '../lib/loc'
import fetch_argv from './argv'

new loc(fetch_argv()).main().then(
  ({ c }) => console.log(c, 'lines counted.'),
  (e) => console.error(e)
)

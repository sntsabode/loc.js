import loc from '../lib/loc'
import fetch_argv from './argv'

loc(fetch_argv()).then(
  ({ c }) => console.log(c, 'lines counted.'),
  (e) => console.error(e)
)

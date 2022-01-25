/*
yarn run mocha -r ts-node/register tests/cli/argv/argv.test.ts --timeout 1000
*/

import { expect } from 'chai'
import { join } from 'path'
import fetch_argv from '../../../src/cli/argv'

const cwd = process.cwd()

describe('process argv test suite', () => {
  it('Should call the fetch_argv function', () => {
    const pargs = ['-yp', './src', './test', '--log', 'y']
    const { yes, paths, log } = fetch_argv(pargs)

    expect(yes).to.be.true
    expect(log).to.equal('y')
    expect(paths!.length).to.equal(2)
    expect(paths).includes(join(cwd, '/src'))
    expect(paths).includes(join(cwd, '/test'))
  })
})

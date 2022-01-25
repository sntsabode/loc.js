/*
yarn run mocha -r ts-node/register tests/cli/argv/parser.test.ts --timeout 1000
*/

import { assert, expect } from 'chai'
import ArgParser from '../../../src/cli/argv/parser'

describe('ArgParser test suite', () => {
  it('Should test a boolean arg', () => {
    interface args { yes?: boolean }

    const pargs = ['--yes']
    let argv = new ArgParser<args>(pargs)
      .arg('yes', { type: 'boolean' })
      .argv

    assert.isTrue(argv.yes)

    pargs[0] = '-y'
    argv = new ArgParser<args>(pargs)
      .arg('yes', { alias: 'y', type: 'boolean' })
      .argv

    assert.isTrue(argv.yes)
  })

  it('Should test a string arg', () => {
    interface args { log?: string, yes?: boolean }

    const pargs = ['--log', 'n']
    let argv = new ArgParser<args>(pargs)
      .arg('log', { type: 'string', choices: ['y', 'n'] })
      .argv

    assert.strictEqual(argv.log, 'n')

    pargs[0] = '-yl', pargs[1] = 'y'
    argv = new ArgParser<args>(pargs)
      .arg('log', {
        alias: 'l',
        type: 'string',
        choices: ['y', 'n']
      })
      .arg('yes', {
        alias: 'y',
        type: 'boolean'
      })
      .argv

    assert.isTrue(argv.yes)
    assert.strictEqual(argv.log, 'y')
  })

  it('Should test an array arg', () => {
    interface args {
      yes?: boolean
      log?: string
      paths?: string[]
    }

    const assertions = (argv: args) => {
      expect(argv.paths).to.include('./src')
      expect(argv.paths).to.include('./tests')
      expect(argv.yes).to.be.true
      expect(argv.log).to.equal('n')
    }

    let pargs = ['--paths', './src', './tests', '-yl', 'n']
    let argv = new ArgParser<args>(pargs)
      .arg('paths', { type: 'array' })
      .arg('yes', { alias: 'y', type: 'boolean' })
      .arg('log', { alias: 'l', type: 'string', choices: ['n']})
      .argv

    assertions(argv)

    pargs = ['-yl', 'n', '-p', './src', './tests']
    argv = new ArgParser<args>(pargs)
      .arg('paths', { alias: 'p', type: 'array' })
      .arg('yes', { alias: 'y', type: 'boolean' })
      .arg('log', { alias: 'l', type: 'string', choices: ['n'] })
      .argv

    assertions(argv)
  })
})

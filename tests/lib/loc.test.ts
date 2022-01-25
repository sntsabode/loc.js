/*
yarn run mocha -r ts-node/register tests/lib/loc.test.ts --timeout 1000
*/

import mock from 'mock-fs'
import { Args } from '../../src/lib/loc/interfaces'
import loc from '../../src/lib/loc'
import { expect } from 'chai'
import { join } from 'path'
import { unsafe } from '../../src/lib/utils'

const cwd = 'MOCK_DIR'

describe('loc test suite', () => {
  before(() => mock({
    [cwd]: {
      'dir': {
        'main.js': file,
        'dir:': {
          'index.ts': file
        }
      },

      'another-dir': {
        'main.js': file,
        'index.ts': file
      },
      'index.js': file
    }
  }))

  it('Should test the loc class', async () => {
    const args: Args = {
      cwd,
      yes: true,
      log: 'n'
    }

    let count = await new loc(args).main()
    expect(count.c).to.equal(9 * 5)

    ;(args as unsafe).paths = [join(cwd, 'another-dir')]

    count = await new loc(args).main()
    expect(count.c).to.equal((9 * 2))
  })

  after(() => mock.restore())
})

const file = `
1
2
3
4
5
6
7
8
9
`.trimStart()

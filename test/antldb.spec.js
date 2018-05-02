'use strict'

const test = require('japa')
const setup = require('./setup')

test.group('Antldb', (group) => {
  group.before(async () => {
    await setup.wire()
    await setup.migrateUp()
  })

  group.beforeEach(async () => {
    await use('Database').beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await use('Database').rollbackGlobalTransaction()
  })

  group.after(async () => {
    await setup.migrateDown()
  })

  test('get registeration rules', async (assert) => {
    assert.deepEqual(true, true)
  })
})

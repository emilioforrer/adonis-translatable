'use strict'

const test = require('japa')
const setup = require('./setup')
const moment = require('moment')

function getRole () {
  return use('App/Models/Role')
}

test.group('Antldb', (group) => {
  group.before(async () => {
    await setup.wire()
    await setup.migrateDown()
    await setup.migrateUp()
  })

  group.beforeEach(async () => {
    await use('Database').beginGlobalTransaction()
  })

  group.afterEach(async () => {
    // await use('Database').rollbackGlobalTransaction()
  })

  group.after(async () => {
    use('Database').close()
  })

  test('test role trait', async (assert) => {
    let role = await getRole().create({
      slug: 'admin',
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    role.name = 'Administrator'
    assert.deepEqual(role.name, 'Administrator')
    await role.save()
    let translation = role.getRelated('translation')
    assert.deepEqual(translation.name, 'Administrator')

    role = await getRole().query().first()
    assert.deepEqual(role.name, 'Administrator')

    const objectRole = role.toObject()

    assert.deepEqual(objectRole.name, 'Administrator')

    const jsonRole = role.toObject()

    assert.deepEqual(jsonRole.name, 'Administrator')

    let roles = await getRole().all()
    for (let record of roles.rows) {
      assert.deepEqual(record.name, 'Administrator')
    }
  })
})

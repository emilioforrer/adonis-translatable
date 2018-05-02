'use strict'

/**
 * adonis-persona
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

process.env.SILENT_ENV = true

const path = require('path')
const { registrar, ioc } = require('@adonisjs/fold')
const { setupResolver, Helpers } = require('@adonisjs/sink')

module.exports = {
  wire: async function () {
    setupResolver()
    ioc.bind('Adonis/Src/Helpers', () => new Helpers(path.join(__dirname, '..', 'app')))

    await registrar.providers([
      '@adonisjs/framework/providers/AppProvider',
      '@adonisjs/lucid/providers/LucidProvider',
      '@adonisjs/validator/providers/ValidatorProvider'
    ]).registerAndBoot()

    ioc.singleton('App/Models/Role', (app) => {
      const Model = app.use('Model')
      class Role extends Model {

      }
      Role._bootIfNotBooted()
      return Role
    })

    ioc.singleton('App/Models/RoleTranslation', (app) => {
      const Model = app.use('Model')
      class RoleTranslation extends Model {

      }
      RoleTranslation._bootIfNotBooted()
      return RoleTranslation
    })

  },

  async migrateUp () {
    await use('Database').schema.createTable('languages', (table) => {
      table.string('name')
      table.string('code').primary()
      table.timestamps()
    })

    await use('Database').schema.createTable('roles', (table) => {
      table.increments()
      table.string('slug').notNullable().unique()
      table.timestamps()
    })

    await use('Database').schema.createTable('roles_translations', (table) => {
      table.increments()
      table.timestamps()

      table.string('name').notNullable().unique()
      table.text('description').nullable()
      /*
       * Translation fields
       */
      table.integer('role_id').unsigned()
      table.string('language_code')
      // table.foreign(['role_id', 'language_code'])
      //   .onDelete('CASCADE')
      //   .onUpdate('RESTRICT')
      //   .references(['roles.id', 'languages.code'])
    })
  },

  async migrateDown () {
    await use('Database').schema.dropTableIfExists('languages')
    await use('Database').schema.dropTableIfExists('roles')
    await use('Database').schema.dropTableIfExists('roles_translations')
  }
}

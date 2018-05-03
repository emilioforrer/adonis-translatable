'use strict'

/*
 * adonisjs-translatable
 *
 * (c) Emilio Forrer <dev.emilio.forrer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = use('@adonisjs/fold') // require.main.require('@adonisjs/fold') as for https://forum.adonisjs.com/t/v-4-create-serviceproiver-outside-app/128/19

class TranslatableProvider extends ServiceProvider {
  _registerMiddlewares () {

  }

  _registerTraits () {
    this.app.bind('App/Models/Traits/Translatable', (app) => {
      const Translatable = require('../src/Models/Traits/TranslatableTrait')
      return new Translatable()
    })
  }

  register () {
    this._registerMiddlewares()
    this._registerTraits()
  }

  boot () {
  }
}

module.exports = TranslatableProvider

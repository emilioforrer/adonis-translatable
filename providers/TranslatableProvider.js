'use strict'

/*
 * adonisjs-translatable
 *
 * (c) Emilio Forrer <dev.emilio.forrer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = require('@adonisjs/fold')

class TranslatableProvider extends ServiceProvider {
  _registerMiddlewares () {

  }

  _registerTraits () {
    this.app.bind('App/Models/Traits/EmilioForrer/Translatable', (app) => {
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

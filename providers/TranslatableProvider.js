'use strict'

/**
 * @Author: Emilio Forrer <emilioforrer>
 * @Date:   2018-05-02T22:10:11-06:00
 * @Email:  dev.emilio.forrer@gmail.com
 * @Filename: TranslatableProvider.js
 * @Last modified by:   emilioforrer
 * @Last modified time: 2018-05-06T11:49:42-06:00
 * @License: For the full license information, please view the LICENSE
 * @Copyright: (c) Emilio Forrer
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

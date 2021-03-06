/**
 * @Author: Emilio Forrer <emilioforrer>
 * @Date:   2018-05-06T11:45:54-06:00
 * @Email:  dev.emilio.forrer@gmail.com
 * @Filename: TranslatableTrait.js
 * @Last modified by:   emilioforrer
 * @Last modified time: 2018-05-06T11:49:04-06:00
 * @License: For the full license information, please view the LICENSE
 * @Copyright: (c) Emilio Forrer
 */

const _ = use('lodash')
const Antl = use('Antl')
const pluralize = use('pluralize')

class TranslatableTrait {
  async setLocalize (modelInstance, translatableAttributes) {
    for (let translatableAttribute of translatableAttributes) {
      modelInstance.$localizedAttributes[translatableAttribute] = modelInstance[translatableAttribute]
    }
  }

  async localize (modelInstance, translatableAttributes) {
    /* istanbul ignore else */
    if (modelInstance.$persisted) {
      let translation = modelInstance.getRelated('translation')
      /* istanbul ignore else */
      if (!translation) {
        await modelInstance.load('translation')
        translation = modelInstance.getRelated('translation')
      }
      /* istanbul ignore else */
      if (translation) {
        for (let translatableAttribute of translatableAttributes) {
          modelInstance[translatableAttribute] = translation[translatableAttribute]
        }
      }
    }
  }

  async register (Model, customOptions) {
    const defaultOptions = {
      className: '',
      primaryKey: Model.primaryKey,
      foreignKey: `${_.snakeCase(pluralize.singular(Model.table))}_id`,
      attributes: []
    }
    const options = _.extend({}, defaultOptions, customOptions)
    const that = this
    /* istanbul ignore else */
    if (_.isArray(options.attributes)) {
      let _instantiate = Model.prototype._instantiate

      // Model.translatableOptions = options.translatableAttributes

      const _toObject = Model.prototype.toObject

      Model.prototype.toObject = function () {
        let json = _toObject.call(this)
        for (let translatableAttribute of options.attributes) {
          json[translatableAttribute] = this[translatableAttribute]
        }
        return json
      }

      Model.prototype.translation = function () {
        return this.hasOne(
          options.className,
          options.primaryKey,
          options.foreignKey
        ).where('language_code', Antl._locale)
      }

      Model.prototype._instantiate = async function () {
        _instantiate.call(this)
        this.__setters__.push('$localizedAttributes')
        this.$localizedAttributes = {}
        for (let translatableAttribute of options.attributes) {
          this.__setters__.push(translatableAttribute)
        }
        // await that.localize(this, options.attributes)
        await that.setLocalize(this, options.attributes)
      }

      Model.addHook('afterFind', async (modelInstance) => {
        await that.localize(modelInstance, options.attributes)
      })

      Model.addHook('afterFetch', async (instances) => {
        for (const instance of instances) {
          await that.localize(instance, options.attributes)
        }
      })

      Model.addHook('beforeSave', async (instance) => {

      })

      Model.addHook('afterSave', async (instance) => {
        let translation = instance.getRelated('translation')
        if (!translation) {
          await instance.load('translation')
          translation = instance.getRelated('translation')
        }
        if (!translation) {
          let ClassName = use(options.className)
          translation = new ClassName()
          translation.language_code = Antl._locale
        }
        for (let translatableAttribute of options.attributes) {
          translation[translatableAttribute] = instance[translatableAttribute]
        }
        await instance.translation().save(translation)
        instance.$relations['translation'] = translation
      })
    } else {
      throw new Error('option attributes must return an array')
    }
  }
}

module.exports = TranslatableTrait

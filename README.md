# Adonis Translatable

AdonisJS Lucid internationalization models.

## Installation

**npm**

```
npm install @emilioforrer/adonis-translatable
```

**yarn**

```
yarn add @emilioforrer/adonis-translatable
```


Add the provider to your start/app.js file:

```js
const providers = [
   // ...
   "@emilioforrer/providers/TranslatableProvider",
   // ...
 ];
```

## How it works

Basically this addon creates a new relationship called `translations` to main model and delegates it's translatable attributes to the translation model.

So in order to work, you need to create a new model translations for your main model, add a trait and configure it.

## How to use

Let's say we have a model `App/Models/Role` and want to translate the name and description attributes, in order to do that follow the next steps.

1. Let's create the translation table for the model `App/Models/Role`.

```js
schema.createTable('roles_translations', (table) => {
  table.increments()
  table.timestamps()
  /*
   * Translation fields
   */
  table.string('name').nullable()
  table.text('description').nullable()
  table.integer('role_id').unsigned()
  table.string('language_code')
})
```
2. Now let's create the translation model `App/Models/RoleTranslation`

```js
const Model = app.use('Model')
class RoleTranslation extends Model {
  static get table () {
    return 'roles_translations'
  }
}
```

3. Next, we need to add a `trait` to the main model (`App/Models/Role`) and configure the options

```js
const Model = app.use('Model')
class Role extends Model {
  static boot () {
    super.boot()
    this.addTrait('Translatable', {
      className: 'App/Models/RoleTranslation',
      attributes: ['name', 'description']
    })
  }
}
```

## Translatable trait options

* **className:** The name of the translation model. Defaults to: `''`.
* **primaryKey:** This is the primary key that will be used to create the `translation` relationship. Defaults to: `Model.primaryKey`.
* **foreignKey:** This is the foreign key that will be used to create the `translation` relationship. Defaults to: `${singlularized_table_name}_id`.
* **attributes:** The list of attributes that we wish to be delegated to the translation model.

## Development

Great! If you are planning to contribute to the framework, make sure to adhere to following conventions, since a consistent code-base is always joy to work with.

Run the following command to see list of available npm scripts.

**npm**

```bash
npm run
```

**yarn**

```bash
yarn run
```

### Tests & Linting

1. Lint your code using standardJs. Run `yarn run lint` command to check if there are any linting errors.
2. Make sure you write tests for all the changes/bug fixes.
3. Run `yarn run test` to lint and run your tests.

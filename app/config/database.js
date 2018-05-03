const path = require('path')

module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    debug: false,
    connection: {
      filename: path.join(__dirname, '../database.sqlite')
    }
  }
}

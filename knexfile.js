const path = require("path")

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    poll:{
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)// função para ativar o cascade no sqlite
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },

    useNullAsDefault: true
  },
};

const sqliteConnectioin = require('../../sqlite')
const createUsers = require('./createUsers')

async function migrationsRun() {
    const schemas = [
        createUsers
     ].join('');

     sqliteConnectioin()
     .then(db => db.exec(schemas))
     .catch(error => console.error(error));
}

module.exports = migrationsRun;
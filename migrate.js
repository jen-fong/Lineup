const { create } = require('sqlmigrate')
const config = require('config').get('database')

const args = process.argv.slice(2)
const sqlmigrate = create({
  migrationsDir: 'src/server/database/migrations',
  driver: config.get('client'),
  dbConfig: { ...config.get('connection') }
})

if (args[0] === 'create') {
  const name = args[1]
  sqlmigrate.createMigration(name)
}

if (args[0] === 'migrate') {
  sqlmigrate.migrate(undefined, true)
  .then(() => console.log('migration done'))
}

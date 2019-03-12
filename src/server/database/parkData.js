const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const config = require('config').get('database.connection')
const associations = require('./associations.js')
const Promise = require('bluebird')

const db = {}

const sequelize = new Sequelize({
  database: config.database,
  username: config.user,
  password: config.password,
  dialect: 'mysql',
  host: process.env.DB_HOST || config.host,
  port: config.port,
  operatorsAliases: false, // not using any aliases so this is okay
  logging: false,
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
})

fs.readdirSync(path.join(__dirname, '/models'))
.filter(file => path.extname(file) === '.js')
.forEach(file => {
  const model = sequelize['import'](path.join(__dirname, '/models', file))
  const modelName = model.name.substring(0, 1).toUpperCase() +

  model.name.substring(1)
  db[modelName] = model
})

db.sequelize = sequelize
db.Sequelize = sequelize

associations(db)
module.exports = db
global.Promise = Promise

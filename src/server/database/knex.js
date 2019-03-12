const config = require('config').get('database')
const knex = require('knex')(config)

module.exports = knex

const knex = require('../database/knex.js')

function toObject (row, keyName) {
  // converts a row to an object with only specified key name
  return Object.keys(row).reduce((obj, key) => {
    const keys = key.split('.')
    const typeKey = keys[1]

    if (keys[0] === keyName) {
      obj[typeKey] = row[key]
    }
    return obj
  }, {})
}

function fetchParksWithRides () {
  return knex.select(
    'park.name as park.name',
    'park.id as park.id',
    'park.shortName as park.shortName',
    'park.updatedAt as park.updatedAt',
    'park.createdAt as park.createdAt',
    'ride.id as ride.id',
    'ride.libId as ride.libId',
    'ride.name as ride.name',
    'ride.parkId as ride.parkId',
    'ride.createdAt as ride.createdAt',
    'ride.updatedAt as ride.updatedAt',
    'ride.type as ride.type'
  )
  .from('park')
  .leftJoin('ride', 'ride.parkId', 'park.id')
  .where('ride.type', '=', 'ride')
  .then(rows => {
    const rowsByPark = rows.reduce((parks, row) => {
      const toRideObj = toObject(row, 'ride')
      const toParkObj = toObject(row, 'park')

      if (!parks[toParkObj.id]) {
        toParkObj.rides = [toRideObj]
        parks[toParkObj.id] = toParkObj
        return parks
      }

      parks[toParkObj.id].rides.push(toRideObj)
      return parks
    }, {})

    // turn back to array -> similar to sequelize.findAll method
    const toArray = Object.keys(rowsByPark)
    .map(parkId => rowsByPark[parkId])

    return toArray
  })
}

module.exports = {
  fetchParksWithRides
}

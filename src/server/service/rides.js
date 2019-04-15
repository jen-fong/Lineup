const knex = require('../database/knex.js')

function getSearchQuery (search, sqlQuery) {
  // creates the query for when users specify a specific time period
  // such as a date or month
  let hasSearchQuery = false
  if (search && search.trim()) {
    hasSearchQuery = true
  }
  const query = hasSearchQuery ? [sqlQuery, [search]] : ['']
  return query
}

function fetchRideStatsForWeekday (where) {
  const { rideId, day } = where
  const dayQuery = getSearchQuery(day, 'dayname(operatingHour.theDate) = ?')

  return knex('waitTime').select(knex.raw(
    'park.name as parkName, ' +
    'ride.name as rideName, ' +
    'dayname(operatingHour.theDate) as weekday, ' +
    'date_format(convert_tz(waitTime.createdAt, "+00:00", "SYSTEM"), "%H")' +
      'as hour, ' +
    'avg(wait) as averageWait, ' +
    'min(wait) as minWait, ' +
    'max(wait) as maxWait,' +
    'count(*) as count'
  ))
  .leftJoin('ride', 'ride.id', 'waitTime.rideId')
  .leftJoin('park', 'park.id', 'ride.parkId')
  .leftJoin('operatingHour', function () {
    this.on('operatingHour.parkId', '=', 'ride.parkId')
    .andOn(knex.raw(
      'operatingHour.theDate = date_format(convert_tz(' +
      'waitTime.createdAt, "+00:00", "SYSTEM"), "%Y-%m-%d")'))
  })
  .whereRaw('rideId = ?', [rideId])
  .andWhere('waitTime.status', '=', 'Operating')
  .andWhereRaw(...dayQuery)
  .groupBy('parkName')
  .groupBy('rideName')
  .groupBy('hour')
  .groupBy('weekday')
  .orderByRaw('dayofweek(weekday) asc')
  .orderBy('hour', 'asc')
}

function fetchRideStatsByDate (query) {
  const { rideId, date } = query
  const dateQuery = date + '%'

  return knex('waitTime').select(knex.raw(
    'park.name as parkName, ' +
    'ride.name as rideName, ' +
    'waitTime.wait as wait, ' +
    'convert_tz(waitTime.createdAt, "+00:00", "SYSTEM") as time, ' +
    'waitTime.status as status, ' +
    'waitTime.conditions, ' +
    'waitTime.temperature, ' +
    'waitTime.humidity'
  ))
  .leftJoin('ride', 'ride.id', 'waitTime.rideId')
  .leftJoin('park', 'park.id', 'ride.parkId')
  .whereRaw('rideId = ?', [rideId])
  .andWhere('waitTime.status', '=', 'Operating')
  .andWhereRaw(
    'convert_tz(waitTime.createdAt, "+00:00", "SYSTEM") like ?', [dateQuery]
  )
  .orderBy('waitTime.createdAt', 'asc')
}

function fetchRideStatsByMonth (query) {
  const { rideId, month } = query
  const monthQuery = getSearchQuery(month, 'month(operatingHour.theDate) = ?')

  return knex('waitTime').select(knex.raw(
    'month(operatingHour.theDate) as month, ' +
    'avg(wait) as averageWait, ' +
    'max(wait) as maxWait, ' +
    'min(wait) as minWait'
  ))
  .leftJoin('ride', 'ride.id', 'waitTime.rideId')
  .leftJoin('park', 'park.id', 'ride.parkId')
  .leftJoin('operatingHour', function () {
    this.on('operatingHour.parkId', '=', 'ride.parkId')
    .andOn(knex.raw(
      'operatingHour.theDate = date_format(convert_tz(' +
      'waitTime.createdAt, "+00:00", "SYSTEM"), "%Y-%m-%d")'))
  })
  .whereRaw('rideId = ?', [rideId])
  .andWhere('waitTime.status', '=', 'Operating')
  .andWhereRaw(...monthQuery)
  .groupByRaw('month(operatingHour.theDate)')
  .orderByRaw('month(operatingHour.theDate)')
}

module.exports = {
  fetchRideStatsForWeekday,
  fetchRideStatsByDate,
  fetchRideStatsByMonth
}

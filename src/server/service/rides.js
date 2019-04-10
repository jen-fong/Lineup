const knex = require('../database/knex.js')

function fetchRideStatsForWeekday (where) {
  const { rideId, day } = where

  let hasSearchDay = false
  if (day && day.trim()) {
    hasSearchDay = true
  }

  const dayQuery = hasSearchDay
    ? ['dayname(operatingHours.theDate) = ?', [day]] : ['']

  return knex('waitTimes').select(knex.raw(
    'park.name as parkName, ' +
    'ride.name as rideName, ' +
    'dayname(operatingHours.theDate) as weekday, ' +
    'date_format(convert_tz(waitTimes.createdAt, "+00:00", "SYSTEM"), "%H")' +
      'as hour, ' +
    'avg(wait) as averageWait, ' +
    'min(wait) as minWait, ' +
    'max(wait) as maxWait,' +
    'count(*) as count'
  ))
  .leftJoin('ride', 'ride.id', 'waitTimes.rideId')
  .leftJoin('park', 'park.id', 'ride.parkId')
  .leftJoin('operatingHours', function () {
    this.on('operatingHours.parkId', '=', 'ride.parkId')
    .andOn(knex.raw(
      'operatingHours.theDate = date_format(convert_tz(' +
      'waitTimes.createdAt, "+00:00", "SYSTEM"), "%Y-%m-%d")'))
  })
  .whereRaw('rideId = ?', [rideId])
  .andWhere('wait', '>', 0)
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

  return knex('waitTimes').select(knex.raw(
    'park.name as parkName, ' +
    'ride.name as rideName, ' +
    'waitTimes.wait as wait, ' +
    'convert_tz(waitTimes.createdAt, "+00:00", "SYSTEM") as time, ' +
    'waitTimes.status as status, ' +
    'waitTimes.conditions, ' +
    'waitTimes.temperature, ' +
    'waitTimes.humidity'
  ))
  .leftJoin('ride', 'ride.id', 'waitTimes.rideId')
  .leftJoin('park', 'park.id', 'ride.parkId')
  .whereRaw('rideId = ?', [rideId])
  .andWhere('wait', '>', 0)
  .andWhereRaw(
    'convert_tz(waitTimes.createdAt, "+00:00", "SYSTEM") like ?', [dateQuery]
  )
  .orderBy('waitTimes.createdAt', 'asc')
}

module.exports = {
  fetchRideStatsForWeekday,
  fetchRideStatsByDate
}

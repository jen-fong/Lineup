const knex = require('../database/knex.js')

function fetchRideStatsForWeekday (where) {
  const { rideId, searchText } = where

  let hasSearchDay = false
  if (searchText && searchText.trim()) {
    hasSearchDay = true
  }

  const dayQuery = hasSearchDay
    ? ['dayname(operatingHours.theDate) = ?', [searchText]] : ['']

  return knex('waitTimes').select(knex.raw(
    'park.name as parkName, ' +
    'ride.name as rideName, ' +
    'dayname(operatingHours.theDate) as weekday, ' +
    'date_format(convert_tz(waitTimes.createdAt, "+00:00", "SYSTEM"), "%H") as hour, ' +
    'avg(wait) as averageWait, ' +
    'min(wait) as minWait, ' +
    'max(wait) as maxWait,' +
    'count(*) as count'
  ))
  .leftJoin('park', 'park.id', 'waitTimes.parkId')
  .leftJoin('ride', 'ride.id', 'waitTimes.rideId')
  .leftJoin('operatingHours', function () {
    this.on('operatingHours.parkId', '=', 'waitTimes.parkId')
    .andOn(knex.raw(
      'operatingHours.theDate = date_format(convert_tz(waitTimes.createdAt, "+00:00", "SYSTEM"), "%Y-%m-%d")'))
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

module.exports = {
  fetchRideStatsForWeekday
}

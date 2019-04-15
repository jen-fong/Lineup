import { createSelector } from 'reselect'

// converts an array of objects to object assuming no repeating x and y keys
// in the array
function createXY (data, xKey, yKey) {
  return data.map(item => {
    return {
      x: item[xKey],
      y: item[yKey]
    }
  })
}

// converts an array of objects to object given parameters
function xyByKey (data, xKey, yKey, useKey) {
  return data.reduce((accum, item) => {
    const useAsKey = item[useKey]
    const byDay = accum[useAsKey]
    const toXY = {
      x: item[xKey],
      y: item[yKey]
    }

    if (byDay) {
      accum[useAsKey].push(toXY)
    } else {
      accum[useAsKey] = [toXY]
    }
    return accum
  }, {})
}

const rideStats = state => state.rideStats

export const getWeekdays = createSelector(
  [rideStats], stats => {
    return xyByKey(
      stats.weekdays, 'hour', 'averageWait', 'weekday')
  }
)

export const getWeekdaysMax = createSelector(
  [rideStats], stats => {
    return xyByKey(stats.weekdays, 'hour', 'maxWait', 'weekday')
  }
)

export const getWeekdayMin = createSelector(
  [rideStats], stats => {
    return xyByKey(stats.weekdays, 'hour', 'minWait', 'weekday')
  }
)

export const getByDate = createSelector(
  [rideStats], stats => {
    return createXY(stats.byDate, 'time', 'wait')
  }
)

export const getMonths = createSelector(
  [rideStats], stats => {
    return createXY(stats.months, 'month', 'averageWait')
  }
)

export const getMonthsMax = createSelector(
  [rideStats], stats => {
    return createXY(stats.months, 'month', 'maxWait')
  }
)

export const getMonthsMin = createSelector(
  [rideStats], stats => {
    return createXY(stats.months, 'month', 'minWait')
  }
)

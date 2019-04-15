import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ridesActions from '../actions/ridesActions.js'
import AllWeekdaysStats from './dashboard/AllWeekdaysStats.jsx'
import StatsByDate from './dashboard/StatsByDate.jsx'
import WeekdayStats from './dashboard/WeekdayStats.jsx'
import StatsByMonth from './dashboard/StatsByMonth.jsx'

const colorsByIndex = [
  '#396AB1',
  '#DA7C30',
  '#3E9651',
  '#CC2529',
  '#535154',
  '#6B4C9A',
  '#922428',
  '#948B3D'
]

// do not use Object.keys since I did not order them in the db query properly
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

class Main extends React.PureComponent {
  render () {
    const {
      weekdaysStats,
      weekdaysStatsMax,
      weekdaysStatsMin,
      byDate,
      ridesActions,
      ride,
      park,
      monthsStats,
      monthsStatsMax,
      monthsStatsMin
    } = this.props
    const weekdays = Object.keys(weekdaysStats)
    console.log('min', this.props)
    return (
      <div className='col-md-10 offset-md-2 mt-5'>
        {!ride && !park && <p>Select a ride from the left to begin</p>}

        {!!weekdays.length && (
          <React.Fragment>
            <div className='row mt-5'>
              <StatsByDate
                statsByDate={byDate}
                ridesActions={ridesActions}
                rideId={ride}
                parkId={park}
              />
            </div>

            <div className='row mt-5'>
              <AllWeekdaysStats
                allWeekdaysStats={weekdaysStats}
                days={days}
                colorsByIndex={colorsByIndex}
              />
            </div>

            <div className='row mt-5'>
              <WeekdayStats
                stats={weekdaysStats}
                statsMax={weekdaysStatsMax}
                statsMin={weekdaysStatsMin}
                days={days}
              />
            </div>

            <div className='row mt-5'>
              <StatsByMonth
                stats={monthsStats}
                statsMax={monthsStatsMax}
                statsMin={monthsStatsMin}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

// TODO move to selectors

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

function mapStateToProps (state) {
  const { rideStats, parks } = state
  return {
    weekdaysStats: xyByKey(
      rideStats.weekdays, 'hour', 'averageWait', 'weekday'),
    weekdaysStatsMax: xyByKey(rideStats.weekdays, 'hour', 'maxWait', 'weekday'),
    weekdaysStatsMin: xyByKey(rideStats.weekdays, 'hour', 'minWait', 'weekday'),
    byDate: createXY(rideStats.byDate, 'time', 'wait'),
    park: parks.park,
    ride: parks.ride,
    monthsStats: createXY(rideStats.months, 'month', 'averageWait'),
    monthsStatsMax: createXY(rideStats.months, 'month', 'maxWait'),
    monthsStatsMin: createXY(rideStats.months, 'month', 'minWait')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    ridesActions: bindActionCreators(ridesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

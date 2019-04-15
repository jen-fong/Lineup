import React from 'react'
import AllWeekdaysStats from './dashboard/AllWeekdaysStats.jsx'
import WeekdayStats from './dashboard/WeekdayStats.jsx'

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

function WeekView (props) {
  const {
    weekdaysStats,
    weekdaysStatsMax,
    weekdaysStatsMin
  } = props

  return (
    <React.Fragment>
      <div className='row mt-5 week-view'>
        <AllWeekdaysStats
          stats={weekdaysStats}
          days={days}
          colorsByIndex={colorsByIndex}
        />
      </div>

      <div className='row mt-5 week-view'>
        <WeekdayStats
          stats={weekdaysStats}
          statsMax={weekdaysStatsMax}
          statsMin={weekdaysStatsMin}
          days={days}
        />
      </div>
    </React.Fragment>
  )
}

export default WeekView

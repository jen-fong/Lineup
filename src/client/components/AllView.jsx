import React from 'react'
import WeekView from './WeekView.jsx'
import MonthsView from './MonthsView.jsx'
import DateView from './DateView.jsx'

function AllView (props) {
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
  } = props

  return (
    <React.Fragment>
      <DateView
        byDate={byDate}
        ridesActions={ridesActions}
        ride={ride}
        park={park}
      />

      <WeekView
        weekdaysStats={weekdaysStats}
        weekdaysStatsMax={weekdaysStatsMax}
        weekdaysStatsMin={weekdaysStatsMin}
      />

      <MonthsView
        monthsStats={monthsStats}
        monthsStatsMax={monthsStatsMax}
        monthsStatsMin={monthsStatsMin}
      />
    </React.Fragment>
  )
}

export default AllView

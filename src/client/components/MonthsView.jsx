import React from 'react'
import StatsByMonth from './dashboard/StatsByMonth.jsx'

function MonthsView (props) {
  const {
    monthsStats,
    monthsStatsMax,
    monthsStatsMin
  } = props

  return (
    <div className='row mt- 5 month-view'>
      <StatsByMonth
        stats={monthsStats}
        statsMax={monthsStatsMax}
        statsMin={monthsStatsMin}
      />
    </div>
  )
}

export default MonthsView

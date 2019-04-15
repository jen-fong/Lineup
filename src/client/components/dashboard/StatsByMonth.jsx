import React from 'react'
import WithMaxAndMin from './WithMaxAndMin.jsx'
import moment from 'moment'

function toMonthName (month) {
  return moment(month, 'M').format('MMMM')
}

function returnMonthName (month) {
  // return only whole numbers for months
  return month % 1 === 0 && toMonthName(month)
}

function displayCellInfo (hoveredCell) {
  return [{
    title: 'month',
    value: toMonthName(hoveredCell.x)
  }, {
    title: 'wait time',
    value: hoveredCell.y
  }]
}

function StatsByMonth (props) {
  const {
    stats,
    statsMax,
    statsMin
  } = props

  return (<div className='col-md-12'>
    <WithMaxAndMin
      stats={stats}
      statsMax={statsMax}
      statsMin={statsMin}
      graphTitle='Wait Times Comparison by Month'
      tickFormat={returnMonthName}
      yTitle='Wait times by month'
      xTitle='Months'
      hintFormat={displayCellInfo}
    />
  </div>)
}

export default StatsByMonth

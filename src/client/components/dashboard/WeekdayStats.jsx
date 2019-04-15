import React, { useState } from 'react'
import WithMaxAndMin from './WithMaxAndMin.jsx'
import moment from 'moment'
import Select from 'react-select'

function returnHours (value) {
  // only show as full hour
  if (value % 1 === 0) {
    return value
  }
}

function displayCellInfo (hoveredCell) {
  return [{
    title: 'hour',
    value: hoveredCell.x
  }, {
    title: 'wait time',
    value: hoveredCell.y
  }]
}

function WeekdayStats (props) {
  const currentDay = moment().format('dddd')
  let [selected, setSelected] = useState({
    label: currentDay,
    value: currentDay
  })

  function handleSelect (option) {
    setSelected(option)
  }
  const {
    stats,
    statsMax,
    statsMin,
    days
  } = props
  const selectedValue = selected.value

  return (
    <div className='col-md-12 mt-5'>
      <div className='row'>
        <div className='col-md-4'>
          <Select
            options={days.map(day => ({ label: day, value: day }))}
            value={selected}
            onChange={handleSelect}
          />
        </div>
      </div>

      <WithMaxAndMin
        stats={stats[selectedValue]}
        statsMax={statsMax[selectedValue]}
        statsMin={statsMin[selectedValue]}
        tickFormat={returnHours}
        yTitle='Wait times (minutes)'
        xTitle='Hour(24)'
        hintFormat={displayCellInfo}
        graphTitle={`Wait Times Average for ${selectedValue}`}
      />
    </div>
  )
}

export default WeekdayStats

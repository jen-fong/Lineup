import React from 'react'
import StatsByDate from './dashboard/StatsByDate.jsx'

function DateView (props) {
  const {
    byDate,
    ridesActions,
    ride,
    park
  } = props

  return (
    <div className='row mt- 5 date-view'>
      <StatsByDate
        statsByDate={byDate}
        ridesActions={ridesActions}
        rideId={ride}
        parkId={park}
      />
    </div>
  )
}

export default DateView

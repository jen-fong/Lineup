import React, { useState } from 'react'
import moment from 'moment'
import GraphTitle from './GraphTitle.jsx'
import DatePicker from 'react-datepicker'
import {
  FlexibleXYPlot,
  LineMarkSeries,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  Hint
} from 'react-vis'
import useHint from './useHint.js'

const today = moment().toDate()

function StatsByDate (props) {
  const currentDate = moment()
  let [selectedDate, setSelectedDate] = useState(currentDate)

  function handleDateChange (date) {
    const { ridesActions, parkId, rideId } = props
    const toDate = moment(date)
    setSelectedDate(toDate)
    const formattedDate = moment(date).format('YYYY-MM-DD')
    ridesActions.fetchStatsByDate(parkId, rideId, formattedDate)
  }

  const { openHint, removeHint, hoveredCell } = useHint()
  const { statsByDate } = props
  console.log(moment())
  return (
    <div className='col-md-12'>
      <div className='row'>
        <div className='col-md-12'>
          <h6>Select a Date</h6>
          <DatePicker
            onChange={handleDateChange}
            selected={selectedDate.toDate()}
            maxDate={today}
            showDisabledMonthNavigation
          />

          <GraphTitle
            title={`Wait Times for ${selectedDate.format('YYYY-MM-DD')}`}
          />
          <FlexibleXYPlot height={600} xType='ordinal'>
            <VerticalGridLines />
            <HorizontalGridLines />

            <LineMarkSeries
              data={statsByDate}
              onValueMouseOut={removeHint}
              onValueMouseOver={openHint}
              curve='monotoneX'
            />

            <XAxis
              title='Hour (24)'
              tickLabelAngle={90}
              tickFormat={value => {
                const toTime = moment.utc(value).format('HH:mm')
                return toTime
              }}
            />
            <YAxis title='Wait times (minutes)' />
            {hoveredCell && (
              <Hint
                value={hoveredCell}
                format={() => [{
                  title: 'hour',
                  value: moment.utc(hoveredCell.x).format('HH:mm')
                }, {
                  title: 'wait time',
                  value: hoveredCell.y
                }]}
              />
            )}
          </FlexibleXYPlot>
        </div>
      </div>
    </div>
  )
}

export default StatsByDate

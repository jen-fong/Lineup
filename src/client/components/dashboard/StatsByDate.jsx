import React from 'react'
import moment from 'moment'
import GraphTitle from './GraphTitle.jsx'
import HintHOC from './HintHOC.jsx'
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

export class StatsByDate extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selectedDate: moment()
    }
  }
  handleDateChange = date => {
    const { ridesActions, parkId, rideId } = this.props
    this.setState({
      selectedDate: moment(date)
    })
    const formattedDate = moment(date).format('YYYY-MM-DD')

    ridesActions.fetchStatsByDate(parkId, rideId, formattedDate)
  }
  render () {
    const { statsByDate, openHint, removeHint, hoveredCell } = this.props
    const { selectedDate } = this.state

    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h6>Select a Date</h6>
            <DatePicker
              onChange={this.handleDateChange}
              selected={selectedDate.toDate()}
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
}

export default HintHOC(StatsByDate)

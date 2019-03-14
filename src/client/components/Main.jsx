import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import * as ridesActions from '../actions/ridesActions.js'
import {
  FlexibleXYPlot,
  LineMarkSeries,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  Hint,
  DiscreteColorLegend
} from 'react-vis'

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

function GraphTitle ({ title }) {
  return (
    <div className='text-center'>
      <h3>{title}</h3>
    </div>
  )
}

function HintHOC (Component) {
  return class WithHint extends React.PureComponent {
    constructor (props) {
      super(props)
      this.state = {
        hoveredCell: null
      }
    }
    openHint = datapoint => {
      this.setState({
        hoveredCell: datapoint
      })
    }
    removeHint = () => {
      this.setState({
        hoveredCell: null
      })
    }
    render () {
      return <Component
        openHint={this.openHint}
        removeHint={this.removeHint}
        hoveredCell={this.state.hoveredCell}
        {...this.props}
      />
    }
  }
}

class StatsByDate extends React.PureComponent {
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

            <GraphTitle title={`Wait Times for ${selectedDate.format('YYYY-MM-DD')}`} />
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

class AllWeekDaysStats extends React.PureComponent {
  render () {
    const { allWeekdaysStats, openHint, removeHint, hoveredCell } = this.props

    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-10'>
            <GraphTitle title='Wait Times Average by Day' />
            <FlexibleXYPlot height={600}>
              <VerticalGridLines />
              <HorizontalGridLines />
              {days.map((day, i) => {
                return (
                  <LineMarkSeries
                    key={day}
                    data={allWeekdaysStats[day]}
                    onValueMouseOver={openHint}
                    onValueMouseOut={removeHint}
                    curve='monotoneX'
                    color={colorsByIndex[i]}
                  />
                )
              })}

              <XAxis
                title='Hour (24)'
                tickFormat={value => {
                  // only show as full hour
                  if (value % 1 === 0) {
                    return value
                  }
                }}
              />
              <YAxis title='Wait times (minutes)' />
              {hoveredCell && (
                <Hint
                  value={hoveredCell}
                  format={() => [{
                    title: 'hour',
                    value: hoveredCell.x
                  }, {
                    title: 'wait time',
                    value: hoveredCell.y
                  }]}
                />
              )}
            </FlexibleXYPlot>
          </div>

          <div className='col-md-2'>
            <DiscreteColorLegend
              width={250}
              items={days.map((day, i) =>
                ({
                  title: day,
                  color: colorsByIndex[i],
                  stroke: 15
                }))}

            />
          </div>
        </div>
      </div>
    )
  }
}

const AllWeekDaysStatsWithHint = HintHOC(AllWeekDaysStats)
const StatsByDateWithHint = HintHOC(StatsByDate)

class Main extends React.PureComponent {
  render () {
    const {
      allWeekdaysStats,
      byDate,
      ridesActions,
      ride,
      park
    } = this.props
    const weekdays = Object.keys(allWeekdaysStats)

    return (
      <div className='col-md-10 offset-md-2 mt-5'>
        {!weekdays.length && <p>Select a ride from the left to begin</p>}

        <div className='row'>
          <StatsByDateWithHint
            statsByDate={byDate}
            ridesActions={ridesActions}
            rideId={ride}
            parkId={park}
          />
        </div>

        <div className='row'>
          <AllWeekDaysStatsWithHint
            allWeekdaysStats={allWeekdaysStats}
          />
        </div>
      </div>
    )
  }
}

// TODO move to selectors

function createXY (data, xKey, yKey) {
  return data.map(item => {
    return {
      x: item[xKey],
      y: item[yKey]
    }
  })
}

function xyByWeekDay (data, xKey, yKey) {
  return data.reduce((accum, item) => {
    const byDay = accum[item.weekday]
    const toXY = {
      x: item.hour,
      y: item.averageWait
    }

    if (byDay) {
      accum[item.weekday].push(toXY)
    } else {
      accum[item.weekday] = [toXY]
    }
    return accum
  }, {})
}

function mapStateToProps (state) {
  console.log()
  return {
    allWeekdaysStats: xyByWeekDay(state.rideStats.allWeekdays, 'hour', 'averageWait'),
    byDate: createXY(state.rideStats.byDate, 'time', 'wait'),
    park: state.parks.park,
    ride: state.parks.ride
  }
}

function mapDispatchToProps (dispatch) {
  return {
    ridesActions: bindActionCreators(ridesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

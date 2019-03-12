import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
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

class AllWeekDaysStats extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hoveredCell: null
    }
  }
  openHint = (datapoint, event) => {
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
    const { allWeekdaysStats } = this.props
    const { hoveredCell } = this.state

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
                    onValueMouseOver={this.openHint}
                    onValueMouseOut={this.removeHint}
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
              {
                hoveredCell && <Hint
                  value={hoveredCell}
                />
              }
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

class Main extends React.PureComponent {
  render () {
    const { allWeekdaysStats } = this.props
    const weekdays = Object.keys(allWeekdaysStats)

    return (
      <div className='col-md-10 offset-md-2 mt-5'>
        {!weekdays.length && <p>Select a ridefrom the left to begin</p>}

        {!!weekdays.length && <AllWeekDaysStats
          allWeekdaysStats={allWeekdaysStats}
        />}
      </div>
    )
  }
}

function createXY (data, xKey, yKey) {
  return data.reduce((accum, item) => {
    const byDay = accum[item.weekday]
    const toXY = {
      x: item.hour,
      y: item.averageWait
    }

    if (byDay) {
      // console.log(accum[item.weekDay])
      accum[item.weekday].push(toXY)
    } else {
      accum[item.weekday] = [toXY]
    }
    return accum
  }, {})
}

function mapStateToProps (state) {
  return {
    allWeekdaysStats: createXY(state.rideStats.allWeekdays, 'hour', 'averageWait')
  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

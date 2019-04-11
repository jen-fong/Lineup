import React from 'react'
import moment from 'moment'
import Select from 'react-select'
import GraphTitle from './GraphTitle.jsx'
import useHint from './useHint.js'
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

export class WeekdayStats extends React.PureComponent {
  constructor (props) {
    super(props)
    const today = moment().format('dddd')
    this.state = {
      day: {
        value: today,
        label: today
      }
    }
  }
  handleDayChange = option => {
    this.setState({
      day: option
    })
  }
  render () {
    const dayOption = this.state.day
    const day = dayOption.value
    const {
      allWeekdaysStats,
      allWeekdaysStatsMax,
      allWeekdaysStatsMin,
      days
    } = this.props
    const { openHint, removeHint, hoveredCell } = useHint()

    return (
      <div className='col-md-12 mt-5'>
        <div className='row'>
          <div className='col-md-4'>
            <Select
              options={days.map(day => ({ label: day, value: day }))}
              value={dayOption}
              onChange={this.handleDayChange}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-md-10'>
            <GraphTitle title={`Wait Times Average for ${day}`} />
            <FlexibleXYPlot height={600}>
              <VerticalGridLines />
              <HorizontalGridLines />

              <LineMarkSeries
                data={allWeekdaysStats[day]}
                onValueMouseOver={openHint}
                onValueMouseOut={removeHint}
                curve='monotoneX'
              />

              <LineMarkSeries
                data={allWeekdaysStatsMax[day]}
                onValueMouseOver={openHint}
                onValueMouseOut={removeHint}
                curve='monotoneX'
              />

              <LineMarkSeries
                data={allWeekdaysStatsMin[day]}
                onValueMouseOver={openHint}
                onValueMouseOut={removeHint}
                curve='monotoneX'
              />

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

          <div className='col-md-2 mt-5'>
            <DiscreteColorLegend
              width={250}
              items={[{
                title: 'average'
              }, {
                title: 'max'
              }, {
                title: 'min'
              }]}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default WeekdayStats

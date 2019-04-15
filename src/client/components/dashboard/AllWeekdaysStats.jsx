import React from 'react'
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

function AllWeekdaysStats (props) {
  const {
    stats,
    days,
    colorsByIndex
  } = props
  const { removeHint, hoveredCell, openHint } = useHint()

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
                  data={stats[day]}
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

        <div className='col-md-2 mt-5'>
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

export default AllWeekdaysStats

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

function WithMaxAndMin (props) {
  const {
    stats,
    statsMax,
    statsMin,
    tickFormat,
    yTitle,
    xTitle,
    hintFormat,
    graphTitle
  } = props
  const { openHint, removeHint, hoveredCell } = useHint()

  return (
    <div className='row'>
      <div className='col-md-10'>
        <GraphTitle title={graphTitle} />
        <FlexibleXYPlot height={600}>
          <VerticalGridLines />
          <HorizontalGridLines />

          <LineMarkSeries
            data={stats}
            onValueMouseOver={openHint}
            onValueMouseOut={removeHint}
            curve='monotoneX'
          />

          <LineMarkSeries
            data={statsMax}
            onValueMouseOver={openHint}
            onValueMouseOut={removeHint}
            curve='monotoneX'
          />

          <LineMarkSeries
            data={statsMin}
            onValueMouseOver={openHint}
            onValueMouseOut={removeHint}
            curve='monotoneX'
          />

          <XAxis
            title={xTitle}
            tickFormat={tickFormat}
          />
          <YAxis title={yTitle} />
          {hoveredCell && (
            <Hint
              value={hoveredCell}
              format={hintFormat}
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
  )
}

export default WithMaxAndMin

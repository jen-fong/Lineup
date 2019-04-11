import React, { useState } from 'react'
import moment from 'moment'
import Select from 'react-select'
import GraphTitle from './GraphTitle.jsx'
import HintHOC from './HintHOC.jsx'
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
  let [selected, setSelected] = useState(0)

  function handleSelect (option) {
    setSelected(option)
  }

  const selectedValue = selected.value
  const {
    options,
    graphTitle,
    openHint,
    removeHint,
    allStats,
    allStatsMax,
    allStatsMin,
    tickFormat,
    yTitle,
    hoveredCell
  } = props

  return (
    <div className='col-md-12 mt-5'>
      <div className='row'>
        <div className='col-md-4'>
          <Select
            options={options.map(option => ({ label: option, value: option }))}
            value={selected}
            onChange={handleSelect}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-md-10'>
          <GraphTitle title={graphTitle} />
          <FlexibleXYPlot height={600}>
            <VerticalGridLines />
            <HorizontalGridLines />

            <LineMarkSeries
              data={allStats[selectedValue]}
              onValueMouseOver={openHint}
              onValueMouseOut={removeHint}
              curve='monotoneX'
            />

            <LineMarkSeries
              data={allStatsMax[selectedValue]}
              onValueMouseOver={openHint}
              onValueMouseOut={removeHint}
              curve='monotoneX'
            />

            <LineMarkSeries
              data={allStatsMin[selectedValue]}
              onValueMouseOver={openHint}
              onValueMouseOut={removeHint}
              curve='monotoneX'
            />

            <XAxis
              title='Hour (24)'
              tickFormat={tickFormat}
            />
            <YAxis title={yTitle} />
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
      </div>
    </div>
  )
}

export default WithMaxAndMin

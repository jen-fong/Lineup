import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ridesActions from '../actions/ridesActions.js'
import AllView from './AllView.jsx'
import MonthsView from './MonthsView.jsx'
import WeekView from './WeekView.jsx'
import DateView from './DateView.jsx'

function getView (view) {
  const views = {
    all: AllView,
    months: MonthsView,
    week: WeekView,
    date: DateView
  }
  return views[view]
}

const Tab = props => {
  const { text, view, handleTabClick, current } = props

  function handleClick (e) {
    e.preventDefault()
    handleTabClick(view)
  }

  let classname = 'nav-link rounded-0'
  if (current === view) {
    classname = classname + ' active border-top-dark text-dark'
  }
  return (
    <li className='nav-item bg-dark-blue'>
      <a
        className={classname}
        aria-controls={text}
        onClick={handleClick}
        href='#'
      >
        {text}
      </a>
    </li>
  )
}

const Main = props => {
  const [view, setView] = useState('all')
  const { ride, park } = props

  if (!ride || !park) {
    return (<div className='col-md-10 offset-md-2 mt-5'>
      Select a ride from the left to begin
    </div>)
  }

  function handleTabClick (view) {
    setView(view)
  }

  const View = getView(view)
  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-10 offset-md-2'>
          <ul className='nav nav-tabs' id='manageTabs' role='tablist'>
            <Tab
              text='All'
              handleTabClick={handleTabClick}
              view='all'
              current={view}
            />
            <Tab
              text='Months'
              handleTabClick={handleTabClick}
              view='months'
              current={view}
            />
            <Tab
              text='Week'
              handleTabClick={handleTabClick}
              view='week'
              current={view}
            />
            <Tab
              text='Date'
              handleTabClick={handleTabClick}
              view='date'
              current={view}
            />
          </ul>

          <div className='col-md-12 mt-5'>
            <div className='tab-content' id='manageContent'>
              <View {...props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// TODO move to selectors

// converts an array of objects to object assuming no repeating x and y keys
// in the array
function createXY (data, xKey, yKey) {
  return data.map(item => {
    return {
      x: item[xKey],
      y: item[yKey]
    }
  })
}

// converts an array of objects to object given parameters
function xyByKey (data, xKey, yKey, useKey) {
  return data.reduce((accum, item) => {
    const useAsKey = item[useKey]
    const byDay = accum[useAsKey]
    const toXY = {
      x: item[xKey],
      y: item[yKey]
    }

    if (byDay) {
      accum[useAsKey].push(toXY)
    } else {
      accum[useAsKey] = [toXY]
    }
    return accum
  }, {})
}

function mapStateToProps (state) {
  const { rideStats, parks } = state
  return {
    weekdaysStats: xyByKey(
      rideStats.weekdays, 'hour', 'averageWait', 'weekday'),
    weekdaysStatsMax: xyByKey(rideStats.weekdays, 'hour', 'maxWait', 'weekday'),
    weekdaysStatsMin: xyByKey(rideStats.weekdays, 'hour', 'minWait', 'weekday'),
    byDate: createXY(rideStats.byDate, 'time', 'wait'),
    park: parks.park,
    ride: parks.ride,
    monthsStats: createXY(rideStats.months, 'month', 'averageWait'),
    monthsStatsMax: createXY(rideStats.months, 'month', 'maxWait'),
    monthsStatsMin: createXY(rideStats.months, 'month', 'minWait')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    ridesActions: bindActionCreators(ridesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

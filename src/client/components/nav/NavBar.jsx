import React from 'react'
import * as parksActions from '../../actions/parksActions.js'
import * as ridesActions from '../../actions/ridesActions.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ParkLink from './ParkLink.jsx'
import moment from 'moment'

class NavSection extends React.PureComponent {
  render () {
    const { parks, testText, park: selectedPark, ...props } = this.props
    return (
      parks.map(park => {
        if (park.name.toUpperCase().includes(testText)) {
          return (
            <ParkLink
              park={park}
              key={park.name}
              selectedPark={selectedPark}
              {...props}
            />
          )
        }
      })
    )
  }
}

class NavBar extends React.PureComponent {
  componentDidMount () {
    const { parksActions } = this.props

    parksActions.fetchParksAndRides()
  }
  handleRideSelection = option => {
    const { parksActions, ridesActions, park } = this.props
    const today = moment().format('YYYY-MM-DD')

    parksActions.setSelection(option)
    ridesActions.fetchStatsForWeekdays(park, option.id)
    ridesActions.fetchStatsByDate(park, option.id, today)
    ridesActions.fetchStatsForMonths(park, option.id)
  }
  render () {
    const { parksActions, ...props } = this.props

    return (
      <div className='col-md-2 d-md-block bg-dark sidebar'>
        <nav>
          <div className='sidebar-sticky'>
            <h6
              className={
                'sidebar-heading d-flex justify-content-between' +
                'align-items-center px-3 mt-4 mb-1 text-light'
              }
            >
              Disney World
            </h6>
            <ul className='nav flex-column mb-2'>
              <NavSection
                testText='DISNEY'
                setPark={parksActions.setPark}
                setRideSelection={this.handleRideSelection}
                {...props}
              />
            </ul>

            <h6
              className={
                'sidebar-heading d-flex justify-content-between' +
                'align-items-center px-3 mt-4 mb-1 text-light'
              }
            >
              Universal Orlando
            </h6>
            <ul className='nav flex-column mb-2'>
              <NavSection
                testText='UNIVERSAL'
                setPark={parksActions.setPark}
                setRideSelection={this.handleRideSelection}
                {...props}
              />
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    parks: state.parks.all,
    park: state.parks.park,
    selection: state.parks.selection
  }
}

function mapDispatchToProps (dispatch) {
  return {
    parksActions: bindActionCreators(parksActions, dispatch),
    ridesActions: bindActionCreators(ridesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

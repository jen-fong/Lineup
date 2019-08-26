import React from 'react'
import { Collapse } from 'reactstrap'
import Select from 'react-select'

class ParkLink extends React.PureComponent {
  setPark = () => {
    const { setPark, park } = this.props
    setPark(park.id)
  }
  render () {
    const { park, selection, setRideSelection, selectedPark } = this.props
    const isOpen = park.id === selectedPark

    return (
      <li
        className='nav-item'
      >
        <a
          className='nav-link'
          href='#'
          onClick={this.setPark}
        >
          {park.shortName}
          <i className='fa fa-caret-down ml-1' />
        </a>

        {isOpen &&
          <Collapse isOpen={isOpen}>
            <ul>
              <li
                className='nav-item'
              >
                <a
                  className='nav-link'
                  href='#'
                >
                  Rides
                </a>

                <div className='col-md-12'>
                  <Select
                    name='ride'
                    options={park.rides.asMutable()}
                    value={selection}
                    onChange={setRideSelection}
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                  />
                </div>
              </li>
            </ul>
          </Collapse>
        }
      </li>
    )
  }
}

export default ParkLink

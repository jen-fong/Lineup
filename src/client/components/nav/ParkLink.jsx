import React from 'react'
import { Collapse } from 'reactstrap'
import SelectPicker from '../SelectPicker.jsx'

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
          {park.shortName}&nbsp;&nbsp;
          <i className='fa fa-caret-down' />
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

                <SelectPicker
                  options={park.rides}
                  selectedOption={selection}
                  handleChange={setRideSelection}
                  name='ride'
                />
              </li>
            </ul>
          </Collapse>
        }
      </li>
    )
  }
}

export default ParkLink

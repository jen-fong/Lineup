import * as constants from '../constants.js'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
  allWeekdays: [],
  byDate: []
})

export default function (state = initialState, action) {
  switch (action.type) {
    case `${constants.RIDE_WEEKDAYS_GET}_FULFILLED`:
      return state.merge({ allWeekdays: action.payload })

    case `${constants.RIDE_DATE_GET}_FULFILLED`:
      return state.merge({
        byDate: action.payload
      })
  }
  return state
}

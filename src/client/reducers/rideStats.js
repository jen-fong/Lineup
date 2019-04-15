import * as constants from '../constants.js'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
  weekdays: [],
  byDate: [],
  months: []
})

export default function (state = initialState, action) {
  switch (action.type) {
    case `${constants.RIDE_WEEKDAYS_GET}_FULFILLED`:
      return state.merge({ weekdays: action.payload })

    case `${constants.RIDE_DATE_GET}_FULFILLED`:
      return state.merge({
        byDate: action.payload
      })

    case `${constants.RIDE_MONTHS_GET}_FULFILLED`:
      return state.merge({ months: action.payload })
  }
  return state
}

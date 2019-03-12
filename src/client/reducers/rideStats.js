import * as constants from '../constants.js'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
  allWeekdays: []
})

export default function (state = initialState, action) {
  switch (action.type) {
    case `${constants.RIDES_WEEKDAYS_GET}_FULFILLED`:
      return state.merge({ allWeekdays: action.payload })
  }
  return state
}

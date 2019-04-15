import * as constants from '../constants.js'
import Immutable from 'seamless-immutable'

const initialState = Immutable({
  park: null,
  all: [],
  ride: null
})

export default function (state = initialState, action) {
  switch (action.type) {
    case `${constants.PARKS_GET}_FULFILLED`:
      return state.merge({
        all: action.payload
      })
    case constants.SELECTION_SET:
      return state.merge({
        ride: action.selection.id
      })
    case constants.PARK_SET:
      return state.merge({
        park: action.park
      })
  }

  return state
}

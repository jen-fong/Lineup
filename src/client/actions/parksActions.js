import * as constants from '../constants.js'
import request from './request.js'

export const fetchParksAndRides = () => dispatch => {
  return dispatch({
    type: constants.PARKS_GET,
    payload: request({
      method: 'GET',
      url: '/parks'
    })
  })
}

export const setSelection = selection => {
  return {
    type: constants.SELECTION_SET,
    selection
  }
}

export const setPark = park => {
  return {
    type: constants.PARK_SET,
    park
  }
}

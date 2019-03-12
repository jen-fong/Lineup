import * as constants from '../constants.js'
import request from './request.js'

export const fetchStatsForWeekdays = (parkId, rideId) => dispatch => {
  return dispatch({
    type: constants.RIDES_WEEKDAYS_GET,
    payload: request({
      method: 'GET',
      url: `/parks/${parkId}/rides/${rideId}/weekdays`
    })
  })
}

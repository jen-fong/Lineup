import * as constants from '../constants.js'
import request from './request.js'

export const fetchStatsForWeekdays = (parkId, rideId, day) => dispatch => {
  return dispatch({
    type: constants.RIDE_WEEKDAYS_GET,
    payload: request({
      method: 'GET',
      url: `/parks/${parkId}/rides/${rideId}/weekdays`,
      params: {
        day
      }
    })
  })
}

export const fetchStatsByDate = (parkId, rideId, date) => dispatch => {
  return dispatch({
    type: constants.RIDE_DATE_GET,
    payload: request({
      method: 'GET',
      url: `/parks/${parkId}/rides/${rideId}/date`,
      params: { date }
    })
  })
}

export const fetchStatsForMonths = (parkId, rideId, month) => dispatch => {
  return dispatch({
    type: constants.RIDE_MONTHS_GET,
    payload: request({
      method: 'GET',
      url: `/parks/${parkId}/rides/${rideId}/months`,
      params: { month }
    })
  })
}

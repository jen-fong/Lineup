import { combineReducers } from 'redux'
import parks from './parks.js'
import rideStats from './rideStats.js'

const reducers = combineReducers({
  parks,
  rideStats
})

export default reducers

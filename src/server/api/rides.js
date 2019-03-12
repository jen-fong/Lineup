const express = require('express')
const router = express.Router()
const wrap = require('../wrap.js')
const ridesService = require('../service/rides.js')

router.get('/:parkId/rides/:rideId/weekdays', wrap((req, res) => {
  const { parkId, rideId } = req.params
  const { q, searchText } = req.query

  return ridesService.fetchRideStatsForWeekday({
    rideId,
    parkId,
    searchText
  })
}))

module.exports = router

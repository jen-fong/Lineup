const express = require('express')
const router = express.Router()
const wrap = require('../wrap.js')
const { Park, Ride } = require('../database/parkData.js')
const parkService = require('../service/parks.js')

router.get('/', wrap((req, res) => {
  return parkService.fetchParksWithRides()
}))

module.exports = router

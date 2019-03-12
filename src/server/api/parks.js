const express = require('express')
const router = express.Router()
const wrap = require('../wrap.js')
const { Park, Ride } = require('../database/parkData.js')

router.get('/', wrap((req, res) => {
  return Park.findAll({
    include: [{
      model: Ride
    }]
  })
}))

module.exports = router

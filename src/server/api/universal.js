const express = require('express')
const router = express.Router()
const wrap = require('../wrap.js')

router.get('/', wrap((req, res) => {
  return Promise.resolve({})
}))

module.exports = router

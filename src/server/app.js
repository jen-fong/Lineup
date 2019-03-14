'use strict'
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const config = require('config')
const ridesRouter = require('./api/rides.js')
const parksRouter = require('./api/parks.js')

const app = express()
const router = express.Router()
const context = config.get('app.host')
const views = path.join(__dirname, '../views/layouts')
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: views,
  partialsDir: path.join(__dirname, '../views/partials')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  // log here?

  next()
})

app.locals = { context }
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', views)

app.get('/', (req, res) => res.redirect(context))

router.use(express.static(path.join(__dirname, '../../public')))
router.use('/css/bootstrap', express.static(path.join(
  __dirname, '../../node_modules/bootstrap/dist/css'
)))
router.use('/css/font-awesome', express.static(path.join(
  __dirname, '../../node_modules/font-awesome/css'
)))
router.use('/css/fonts', express.static(path.join(
  __dirname, '../../node_modules/font-awesome/fonts'
)))
router.use('/css/react-vis', express.static(path.join(
  __dirname, '../../node_modules/react-vis/dist'
)))
router.use('/css/datepicker', express.static(path.join(
  __dirname, '../../node_modules/react-datepicker/dist'
)))

router.use('/api/parks', parksRouter)
router.use('/api/parks', ridesRouter)
router.get('/*', (req, res) => {
  res.render('home')
})

app.use(context, router)

// app.use(context)

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.status ? err.message : 'An error occured',
    messages: err.errors
  })
  console.log(err)
})

module.exports = app

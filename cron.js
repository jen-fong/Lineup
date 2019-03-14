const themeparks = require('themeparks')
const moment = require('moment')
const weather = require('weather-js')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: null,
    database: 'parkData',
    timezone: 'UTC'
  }
})

const now = moment()
const today = now.format('YYYY-MM-DD')

function promiseifyWeather () {

  return new Promise((resolve, reject) => {
    weather.find({
      search: 'Orlando, FL',
      degreeType: 'F'
    }, (err, res) => {
      if (err) {
        console.log('error while retrieving weather')
        reject(err)
      }
      resolve(res)
    })
  })
}

function getParkSchedule (themePark) {
  return themePark.FetchOpeningTimes()
  .then(() => {
    const scheduleSymbols = Object.getOwnPropertySymbols(themePark.Schedule)
    const operatingHours = themePark.Schedule[scheduleSymbols[0]]
    // the first item should be from today but it seems occasionally I get
    // data from the day before when it is 12 am
    // this ensures the data is for today by matching up the dates
    // of operation with the current date
    const todaysSchedule = Array.from(operatingHours).filter(schedule => {
      if (schedule[1].date === today) {
        return schedule
      }
    })[0]
    const specialOperatingHours = themePark.Schedule[scheduleSymbols[1]].get(todaysSchedule[0])
    const { openingTime, closingTime } = todaysSchedule[1]

    return {
      openingTime,
      closingTime,
      specialOperatingHours
    }
  })
}

function insertOperatingHours (schedule, parkId) {
  const { openingTime, closingTime, specialOperatingHours, park } = schedule

  return knex('operatingHours').insert({
    parkOpen: moment(openingTime).toDate(),
    parkClose: moment(closingTime).toDate(),
    specialHours: specialOperatingHours && specialOperatingHours[0].type || null,
    specialHoursOpen: specialOperatingHours && moment(specialOperatingHours[0].openingTime).toDate(),
    specialHoursClose: specialOperatingHours && moment(specialOperatingHours[0].closingTime).toDate(),
    theDate: today,
    parkId: parkId,
    createdAt: moment().toDate(),
    updatedAt: moment().toDate()
  })
}

const parks = [
  'WaltDisneyWorldHollywoodStudios',
  'WaltDisneyWorldAnimalKingdom',
  'WaltDisneyWorldMagicKingdom',
  'WaltDisneyWorldEpcot',
  'UniversalStudiosFlorida',
  'UniversalIslandsOfAdventure'
]

function checkIfParkIsOpen (opHours) {
  // opHours should all be utc right now
  // since orlando is est, it is much easier to compare current date and
  // and time by converting the db values to est

  const {
    parkClose,
    parkOpen,
    specialHours,
    specialHoursClose,
    specialHoursOpen
  } = opHours

  // in case the parks allow people to enter early and they update the
  // wait times before opening
  const dbParkTimeClosed = moment(parkClose).add(1, 'hours').utcOffset('-05:00')
  const dbParkTimeOpen = moment(parkOpen)
  .subtract(1, 'hours')
  .utcOffset('-05:00')
  const dbSpecialTimeOpen = specialHours &&
    moment(specialHoursOpen).utcOffset('-05:00')
  const dbSpecialTimeClose = specialHours &&
    moment(specialHoursClose).utcOffset('-05:00')

  const isOpen = now.isBetween(dbParkTimeOpen, dbParkTimeClosed, 'hour', [])
  const isSpecialHours = now.isBetween(
    dbSpecialTimeOpen, dbSpecialTimeClose, []
  )

  return isOpen || isSpecialHours
}

let currentWeather
const parkWaitTimes = parks.map(park => {
  console.log('creating park', park)
  const themePark = new themeparks.Parks[park]()

  console.log('searching for park in database', park)
  return knex('park').where({
    name: park
  })
  .then(dbPark => {
    console.log('retrieved park from db', park, today, dbPark[0].id)
    return knex('operatingHours').where({
      theDate: today,
      parkId: dbPark[0].id
    })
    .then(opHours => {
      if (!opHours.length) {
        console.log('operating hours for today not found', park)
        console.log('retrieving from api and inserting...')
        return getParkSchedule(themePark)
        .then(schedule => insertOperatingHours(schedule, dbPark[0].id))
        .then(() => knex('operatingHours').where({
          theDate: today,
          parkId: dbPark[0].id
        }))
        .then(dbSchdule => checkIfParkIsOpen(dbSchdule[0]))
      }
      return checkIfParkIsOpen(opHours[0])
    })
    .then(isOpen => {
      if (!isOpen) {
        console.log('park is not open, we will start when it opens')
        return
      }

      console.log('retrieving wait times of rides', park)
      return themePark.GetWaitTimes()
      .then(rideWaitTimes => {
        const insertRideTimes = rideWaitTimes.map(ride => {
          return knex('ride').where({
            libId: ride.id
          })
          .then(dbRide => {
            if (!dbRide || !dbRide.length) {
              return knex('ride').insert({
                name: ride.name,
                libId: ride.id,
                createdAt: moment().toDate(),
                updatedAt: moment().toDate()
              })
            }
            return [dbRide[0].id]
          })
          .then(dbRide => {
            return knex('waitTimes').insert({
              parkId: dbPark[0].id,
              wait: ride.waitTime || 0,
              rideId: dbRide[0],
              lastUpdated: moment(ride.lastUpdate).toDate(),
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
              status: ride.status,
              fastPassStart: ride.fastPassReturnTime &&
                moment(ride.fastPassReturnTime.startTime).toDate() || null,
              fastPassEnd: ride.fastPassReturnTime &&
                moment(ride.fastPassReturnTime.endTime).toDate() || null,
              temperature: currentWeather.temperature,
              humidity: currentWeather.humidity,
              conditions: currentWeather.skytext
            })
          })
        })
        console.log('inserting rides', insertRideTimes.length, park)
        return Promise.all(insertRideTimes)
      })
    })
  })
})

console.log(moment())
promiseifyWeather()
.then(weather => {
  console.log('retrieving weather')
  currentWeather = weather[0].current
})
.then(() => Promise.all(parkWaitTimes))
.then(() => knex.destroy())
.catch(e => {
  console.log(e)
  knex.destroy()
})
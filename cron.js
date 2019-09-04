const themeparks = require('themeparks')
const moment = require('moment')
const weather = require('weather-js')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    user: 'root',
    password: null,
    database: 'parkData',
    timezone: 'UTC',
    host: '127.0.0.1',
    port: 3306
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
  return themePark.GetOpeningTimes()
  .then(operatingHours => {
    // the first item should be from today but it seems occasionally I get
    // data from the day before when it is 12 am
    // this ensures the data is for today by matching up the dates
    // of operation with the current date
    const todaysSchedule = Array.from(operatingHours).filter(schedule => {
      if (schedule.date === today) {
        return schedule
      }
    })[0]

    const specialOperatingHours = todaysSchedule.special &&
      todaysSchedule.special[0]
    const { openingTime, closingTime } = todaysSchedule

    return {
      openingTime,
      closingTime,
      specialOperatingHours
    }
  })
}

function insertOperatingHours (schedule, parkId) {
  const { openingTime, closingTime, specialOperatingHours } = schedule

  return knex('operatingHour').insert({
    parkOpen: moment(openingTime).toDate(),
    parkClose: moment(closingTime).toDate(),
    specialHours: specialOperatingHours && specialOperatingHours.type ||
      null,
    specialHoursOpen: specialOperatingHours &&
      moment(specialOperatingHours.openingTime).toDate(),
    specialHoursClose: specialOperatingHours &&
      moment(specialOperatingHours.closingTime).toDate(),
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

function determineRideType (ride) {
  if (ride.active && ride.waitTime === 0) {
    return 'activity'
  } else if (ride.active && ride.waitTime > 0) {
    return 'ride'
  } else if (!ride.active && (ride.refurbishment || ride.status === 'Down')) {
    return 'ride'
  }
  return 'activity'
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
    return knex('operatingHour').where({
      theDate: today,
      parkId: dbPark[0].id
    })
    .then(opHours => {
      if (!opHours.length) {
        console.log('operating hours for today not found', park)
        console.log('retrieving from api and inserting...')
        return getParkSchedule(themePark)
        .then(schedule => insertOperatingHours(schedule, dbPark[0].id))
        .then(() => knex('operatingHour').where({
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
            const rideType = determineRideType(ride)
            // only insert if ride does not exist
            if (!dbRide || !dbRide.length) {
              return knex('ride').insert({
                name: ride.name,
                libId: ride.id,
                type: rideType,
                createdAt: moment().toDate(),
                updatedAt: moment().toDate()
              })
            }

            // sometimes disney changes the name to show closures. This will
            // update our db so it shows up properly. We also update the ride
            // since it is very difficult to determine whether something is a
            // ride or show
            if (dbRide[0].name !== ride.name || rideType !== dbRide[0].type) {
              return knex('ride')
              .where({ libId: ride.id })
              .update({
                type: rideType,
                name: ride.name
              })
              .then(() => [dbRide[0].id])
            }
            return [dbRide[0].id]
          })
          .then(dbRide => {
            return knex('waitTime').insert({
              wait: ride.waitTime || 0,
              rideId: dbRide[0],
              lastUpdated: moment(ride.lastUpdate).toDate(),
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
              status: ride.status,
              temperature: currentWeather.temperature,
              humidity: currentWeather.humidity,
              conditions: currentWeather.skytext
            })
          })
        })
        console.log('inserting/updating rides', insertRideTimes.length, park)
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

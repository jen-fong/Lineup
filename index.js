const themeparks = require('themeparks')
const moment = require('moment')
const weather = require('weather-js')
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: null,
    database: 'parkData'
  }
})
const today = moment().format('YYYY-MM-DD')

function promiseifyWeather () {
  return new Promise((resolve, reject) => {
    weather.find({
      search: 'Orlando, FL',
      degreeType: 'F'
    }, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
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

const parkWaitTimes = parks.map(park => {
  console.log('creating park', park)
  const themePark = new themeparks.Parks[park]()

  let currentWeather
  return promiseifyWeather()
  .then(weather => {
    currentWeather = weather[0].current
  })
  .then(() => {
    return themePark.FetchOpeningTimes()
    .then(() => {
      console.log('received schedule')
      const scheduleSymbols = Object.getOwnPropertySymbols(themePark.Schedule)
      const operatingHours = themePark.Schedule[scheduleSymbols[0]]
      const todaysSchedule = Array.from(operatingHours)[0]
      const specialOperatingHours = themePark.Schedule[scheduleSymbols[1]].get(todaysSchedule[0])

      const { openingTime, closingTime } = todaysSchedule[1]

      return themePark.GetWaitTimes()
      .then(rideWaitTimes => {
        return knex('park').where({
          name: park
        })
        .then(dbPark => {
          return knex('operatingHours').where({
            theDate: today.toString(),
            parkId: dbPark[0].id
          })
          .then(opHours => {
            if (!opHours || !opHours.length) {
              return knex('operatingHours').insert({
                parkOpen: moment(openingTime).toDate(),
                parkClose: moment(closingTime).toDate(),
                specialHours: specialOperatingHours && specialOperatingHours[0].type || null,
                specialHoursOpen: specialOperatingHours && moment(specialOperatingHours[0].openingTime).toDate(),
                specialHoursClose: specialOperatingHours && moment(specialOperatingHours[0].closingTime).toDate(),
                theDate: today.toString(),
                parkId: dbPark[0].id
              })
            }
          })
          .then(() => {
            const insertRideTimes = rideWaitTimes.map(ride => {
              return knex('ride').where({
                libId: ride.id
              })
              .then(dbRide => {
                if (!dbRide || !dbRide.length) {
                  return knex('ride').insert({
                    name: ride.name,
                    libId: ride.id
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
                  status: ride.status,
                  fastPassStart: ride.fastPassReturnTime && moment(ride.fastPassReturnTime.startTime).toDate() || null,
                  fastPassEnd: ride.fastPassReturnTime && moment(ride.fastPassReturnTime.endTime).toDate() || null,
                  temperature: currentWeather.temperature,  
                  humidity: currentWeather.humidity,
                  conditions: currentWeather.skytext
                })
              })
            })
            console.log('park ride length', insertRideTimes.length)
            return Promise.all(insertRideTimes)
          })
        })
      })
    })
  })
})

console.log('=======================================================')
console.log(moment())
Promise.all(parkWaitTimes)
.then(() => knex.destroy())
.catch(e => {
  console.log(e)
  knex.destroy()
})

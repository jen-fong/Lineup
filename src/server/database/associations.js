module.exports = db => {
  let {
    Ride,
    Park,
    WaitTimes,
    OperatingHours
  } = db

  Park.hasMany(Ride)
  Ride.belongsTo(Park)

  WaitTimes.belongsTo(Ride)
  Ride.hasMany(WaitTimes)

  // need to delete
  WaitTimes.belongsTo(Park)
  Park.hasMany(WaitTimes)

  Park.hasMany(OperatingHours)
  OperatingHours.belongsTo(Park)
}

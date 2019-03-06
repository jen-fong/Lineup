const port = process.env.PORT || 3000
const app = require('./src/server/app.js')

app.listen(port, () => {
  console.log('listening on port ', port)
})

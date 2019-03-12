import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import { logger } from 'redux-logger'
import reducers from './reducers'

const store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware, promiseMiddleware, logger)
)

export default store

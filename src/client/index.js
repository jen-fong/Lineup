import React from 'react'
import ReactDOM from 'react-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import context from './context.js'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={context}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'

import store from './store'
import App from './router'
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('root')
  )

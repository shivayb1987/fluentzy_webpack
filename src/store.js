import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import getLocale from 'locales'

import reducer from './reducers'
export const history = createHistory()

const reduxRouterMiddleware = routerMiddleware(history)
// for i18n
const initialLocale = 'en-IN'
const messages = getLocale(initialLocale)

// export appDefaultState as well
export const appDefaultState = {
  intl: {
    locale: initialLocale,
    messages
  }
}
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  appDefaultState,
  applyMiddleware(sagaMiddleware, reduxRouterMiddleware)
)
sagaMiddleware.run(sagas)

export default store

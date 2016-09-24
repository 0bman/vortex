import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'
import configureStore from './store/configureStore'
import './app.global.scss'
import { whyDidYouUpdate } from 'why-did-you-update'

const store = configureStore(),
      history = syncHistoryWithStore(hashHistory, store, {
        selectLocationState(state) {
          return state.get('routing')
        }
      })

if (process.env.NODE_ENV !== 'production') {
  whyDidYouUpdate(React, { include: /^pure/ })
}

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)

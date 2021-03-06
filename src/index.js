import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Router from 'react-router/lib/Router'
import hashHistory from 'react-router/lib/hashHistory'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'
import configureStore from './store/configureStore'

import './styles/index.scss'

const store = configureStore(),
      history = syncHistoryWithStore(hashHistory, store, {
        selectLocationState(state) {
          return state.get('routing').toObject()
        }
      })

// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouUpdate = require('why-did-you-update/').whyDidYouUpdate
//   whyDidYouUpdate(React)
// }

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)

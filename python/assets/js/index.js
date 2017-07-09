import '../css/index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { initializeCurrentLocation } from 'redux-little-router'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import createPalette from 'material-ui/styles/palette'
import { blue, pink, red } from 'material-ui/colors'

import { actions } from 'Store/Ducks'
import PD from './PD'
import App from './App'
import configureStore from 'Store'

injectTapEventPlugin()

const client = window.client
const schema = window.schema
const pd = new PD(client, schema)

const theme = createMuiTheme({
    palette: createPalette({
        primary: blue,
        accent: pink,
        error: red,
    })
})

const store = configureStore()

// So we can access them in the console
window.store = store
window.pd = pd
window.actions = actions

store.dispatch(actions.apiClient.set(pd))

const initialLocation = store.getState().router
initialLocation.hash = location.hash
if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
}

store.dispatch(actions.me.load(pd)).then(({payload}) => {
    store.dispatch(actions.habits.load(pd, payload.id))
})

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <App apiClient={pd} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

import '../css/index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { initializeCurrentLocation, RouterProvider } from 'redux-little-router'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import createPalette from 'material-ui/styles/palette'
import { blue, pink, red } from 'material-ui/styles/colors'

import { setHabits, setMe } from './actions'
import PD from './PD'
import App from './components/App'
import configureStore from './store'

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
const initialLocation = store.getState().router
if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
}

// So we can access them in the console
window.store = store
window.pd = pd

ReactDOM.render(
    <RouterProvider store={store}>
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <App apiClient={pd} />
            </MuiThemeProvider>
        </Provider>
    </RouterProvider>,
    document.getElementById('root')
);

pd.whoami().then(person => {
    store.dispatch(setMe(person))
    pd.listHabits(person.id).then(habits => {
        store.dispatch(setHabits(habits.results))
    })
})

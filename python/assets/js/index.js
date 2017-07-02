import '../css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore } from 'redux';
import { setHabits, setMe } from './actions'
import { Provider } from 'react-redux'
import PD from './PD'
import pdApp from './reducers'
import App from './components/App'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import createPalette from 'material-ui/styles/palette'
import { blue, pink, red } from 'material-ui/styles/colors'

injectTapEventPlugin();

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

const store = createStore(pdApp)

// So we can access them in the console
window.store = store
window.pd = pd

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <App apiClient={pd} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

pd.whoami().then(person => {
    store.dispatch(setMe(person))
    pd.listHabits(person.id).then(habits => {
        store.dispatch(setHabits(habits.results))
    })
})

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
window.store = store  // So we can access it in the console

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <App apiClient={pd} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);


client.action(schema, ['people', 'read'], {'id': 'me'}).then(function(person) {
    store.dispatch(setMe(person))
    client.action(schema, ['habits', 'list'], {'person': person.id}).then(function(habits){
        store.dispatch(setHabits(habits.results));

    })
});

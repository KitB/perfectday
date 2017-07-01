import '../css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore } from 'redux';
import { setHabits } from './actions'
import { Provider } from 'react-redux'
import PD from './PD'
import pdApp from './reducers'
import App from './components/App'

injectTapEventPlugin();

const client = window.client
const schema = window.schema
const pd = new PD(client, schema)



const store = createStore(pdApp)
window.store = store

ReactDOM.render(
    <Provider store={store}>
        <App apiClient={pd} />
    </Provider>,
    document.getElementById('root')
);


client.action(schema, ['people', 'read'], {'id': 'me'}).then(function(person) {
    window.me = person
    client.action(schema, ['habits', 'list'], {'person': person.id}).then(function(habits){
        console.log(person)
        console.log(habits.results)
        console.log(store)
        store.dispatch(setHabits(habits.results));

    })
});

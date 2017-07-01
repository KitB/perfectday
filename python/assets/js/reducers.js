import { combineReducers } from 'redux';

import { SET_HABITS } from './actions';

function habits(state = [], action) {
    switch(action.type) {
        case SET_HABITS:
            return action.payload.habits;
        default:
            return state;
    }
}

const pdApp = combineReducers({
    habits,
})

export default pdApp;

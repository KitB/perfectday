import { combineReducers } from 'redux'

import { SET_HABITS, SET_ME } from './actions'

function habits(state = [], action) {
    switch(action.type) {
        case SET_HABITS:
            return action.payload.habits
        default:
            return state
    }
}

const defaultMe = {
  worth: 0,
}

function me(state=defaultMe, action) {
    switch(action.type) {
        case SET_ME:
            return action.payload
        default:
            return state
    }
}

const pdApp = combineReducers({
    habits,
    me,
})

export default pdApp

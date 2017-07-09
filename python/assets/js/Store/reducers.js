import { combineReducers } from 'redux'

import { SET_HABITS, SET_ME, SET_API_CLIENT } from './actions'

function habits(state = {}, action) {
    switch(action.type) {
        case SET_HABITS: {
            const out = {}
            for (var habit of action.payload.habits) {
                out[habit.id] = habit
            }
            return out
        }
        default:
            return state
    }
}

const defaultMe = {
    id: 0,
    worth: 0,
    user: {
        email: 'example@example.com',
    },
}

function me(state=defaultMe, action) {
    switch(action.type) {
        case SET_ME:
            return action.payload
        default:
            return state
    }
}

function apiClient(state=null, action) {
    switch(action.type) {
        case SET_API_CLIENT:
            return action.payload
        default:
            return state
    }
}

const pdApp = combineReducers({
    habits,
    me,
    apiClient,
})

export default pdApp

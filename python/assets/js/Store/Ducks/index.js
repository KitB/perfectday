import { combineReducers } from 'redux'
import * as Habits from './Habits'
import * as Me from './Me'
import * as ApiClient from './ApiClient'

export const actions = {
    ...Habits.actions,
    ...Me.actions,
    ...ApiClient.actions,
}

const reducers = {
    habits: Habits.reducer,
    me: Me.reducer,
    apiClient: ApiClient.reducer,
}

export const reducer = combineReducers(reducers)

export const enhancer = thing => thing

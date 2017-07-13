import { combineReducers, applyMiddleware } from 'redux'
import * as Habits from './Habits'
import * as Me from './Me'
import * as ApiClient from './ApiClient'
import * as ProspectiveHabit from './ProspectiveHabit'

export const actions = {
    ...Habits.actions,
    ...Me.actions,
    ...ApiClient.actions,
    ...ProspectiveHabit.actions,
}

const reducers = {
    habits: Habits.reducer,
    me: Me.reducer,
    apiClient: ApiClient.reducer,
    prospectiveHabit: ProspectiveHabit.reducer,
}

export const reducer = combineReducers(reducers)

export const enhancer = applyMiddleware(ProspectiveHabit.middleware)

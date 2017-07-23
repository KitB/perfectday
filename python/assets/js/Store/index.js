import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerForBrowser } from 'redux-little-router'
import promiseMiddleware from 'redux-promise'
import { serialize, deserialize as rawDeserialize } from 'json-immutable'

import { reducer, enhancer as ducksEnhancer } from './Ducks'
import { HabitRecord, ScheduleRecord, PeriodRecord } from 'Store/Ducks/Habits'

const routes = {
    '/home': {
        title: 'Home',
        '/habits': {
            title: 'Habit List',
        },
    },
    '/habit/:id': {
        title: 'Habit detail: ',
        '/edit': {
            title: 'Editing habit: ',
        },
    },
}

const loggerMiddleware = () => next => action => {
    console.log(action)
    return next(action)
}

const { reducer: routeReducer, middleware: routeMiddleware, enhancer: routeEnhancer } = routerForBrowser({
    routes,
    basename: '/frontend',
})

const initialState = () => {
    const deserialize = (json) => rawDeserialize(json, {
        recordTypes: {
            'HabitRecord': HabitRecord,
            'ScheduleRecord': ScheduleRecord,
            'PeriodRecord': PeriodRecord,
        }
    })
    const habits = localStorage.habits ? deserialize(localStorage.habits) : undefined
    const me = localStorage.me ? deserialize(localStorage.me) : undefined
    const prospectiveHabit = localStorage.prospectiveHabit ? deserialize(localStorage.prospectiveHabit) : undefined
    return {
        pd: {
            habits: habits,
            me: me,
            prospectiveHabit: prospectiveHabit,
        },
    }
}

const configureStore = () => {
    const iS = initialState()
    console.log(iS)
    const store = createStore(
        combineReducers({ router: routeReducer, pd: reducer }),
        iS,
        compose(
            routeEnhancer,
            applyMiddleware(routeMiddleware),
            ducksEnhancer,
            applyMiddleware(loggerMiddleware, promiseMiddleware)
        )
    )
    window.onbeforeunload = () => {
        const { pd } = store.getState()
        localStorage.setItem('habits', serialize(pd.habits))
        localStorage.setItem('me', serialize(pd.me))
        localStorage.setItem('prospectiveHabit', serialize(pd.prospectiveHabit))
    }
    return store
}

export default configureStore

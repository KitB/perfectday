import { createActions, handleActions } from 'redux-actions'
import { Set } from 'immutable'

const defaultState = Set()

export const actions = createActions({
    SCHEDULE: {
        BY_DAY: {
            ADD: day => ({
                day: day,
            }),
            DEL: day => ({
                day: day,
            }),
        },

        BY_PERIOD: {
            ADD: (start, period) => ({
                start: start,
                period: period,
            }),
            DEL: (start, period) => ({
                start: start,
                period: period,
            }),
        },
        CLEAR: () => ({}),
        LOAD_HABIT: habit => habit.schedule.periods,
    },
})

export const reducer = handleActions({
    SCHEDULE: {
        BY_DAY: {
            ADD: (state, action) => state.add({start: action.payload.day, period: 1}),
            DEL: (state, action) => state.delete({start: action.payload.day, period: 1}),
        },
        BY_PERIOD: {
            ADD: (state, action) => state.add(action.payload),
            DEL: (state, action) => state.delete(action.payload),
        },
        CLEAR: (state) => state.clear(),
        LOAD_HABIT: (state, action) => Set(action.payload),
    },
}, defaultState)

export const middleware = store => next => action => {
    console.log(action.type)
    console.log('asdfasdfasdfasdf')
    switch (action.type) {
        case 'ROUTER_LOCATION_CHANGED':
            console.log(action.payload.route)
            if (action.payload.route == '/habit/:id') {
                const habit = store.getState().pd.habits[action.payload.params.id]
                store.dispatch(actions.schedule.loadHabit(habit))
            }
            return next(action)
        default:
            return next(action)
    }
}

import { createActions, handleActions } from 'redux-actions'
import { HabitRecord, PeriodRecord } from './Habits'

const defaultState = new HabitRecord()

const periodAction = (start, period) => ({
    period: new PeriodRecord({
        start: start,
        period: period,
    }),
})

export const actions = createActions({
    PROSPECTIVE: {
        HABIT: {
            SAVE: async (apiClient, habit) => {
                const id = habit.id
                var response

                if (id === 'new') {
                    const habitObj = habit.toAPIObj(['id'])
                    response = await apiClient.newHabit(habitObj)
                } else {
                    const habitObj = habit.toAPIObj()
                    response = await apiClient.updateHabit(habitObj)
                }
                return response
            },
            CANCEL: () => {},
            COPY: (habit) => (habit),
            UPDATE: {
                LONG_DESCRIPTION: {
                    SET: (desc) => ({
                        desc: desc,
                    }),
                },
                SHORT_DESCRIPTION: {
                    SET: (desc) => ({
                        desc: desc,
                    }),
                },
                WEIGHT: {
                    SET: (weight) => ({
                        weight: weight,
                    }),
                },
                SCHEDULE: {
                    SET: periodAction,
                    UNSET: periodAction,
                    TOGGLE: periodAction,
                },
            },
        },
    },
})

const setPeriod = (state, periodRecord) => (
    state.updateIn(['schedule', 'periods'], periods => periods.add(periodRecord))
)

const unsetPeriod = (state, periodRecord) => (
    state.updateIn(['schedule', 'periods'], periods => periods.delete(periodRecord))
)

export const reducer = handleActions({
    PROSPECTIVE: {
        HABIT: {
            SAVE: () => defaultState,
            CANCEL: () => defaultState,
            COPY: (state, { payload: habit }) => habit,
            UPDATE: {
                LONG_DESCRIPTION: {
                    SET: (state, { payload: { desc } }) => state.set('long_description', desc),
                },
                SHORT_DESCRIPTION: {
                    SET: (state, { payload: { desc } }) => state.set('short_description', desc),
                },
                WEIGHT: {
                    SET: (state, { payload: { weight } }) => (
                        state.updateIn(['schedule'], schedule => schedule.set('weight', weight))
                    ),
                },
                SCHEDULE: {
                    SET: (state, action) => setPeriod(state, action.payload.period),
                    UNSET: (state, action) => unsetPeriod(state, action.payload.period),
                    TOGGLE: (state, action) => {
                        if (state.schedule.periods.has(action.payload.period)) {
                            return unsetPeriod(state, action.payload.period)
                        } else {
                            return setPeriod(state, action.payload.period)
                        }
                    },
                },
            },
        },
    },
}, defaultState)

export const middleware = store => next => action => {
    const res = next(action)
    switch (action.type) {
        case 'ROUTER_LOCATION_CHANGED':
            if (action.payload.route.startsWith('/habit/:id/edit')) {
                const habit = store.getState().pd.habits.get(Number(action.payload.params.id))
                store.dispatch(actions.prospective.habit.copy(habit))
            }
            return res
        case 'HABITS/LOAD': {
            const state = store.getState()
            if (state.router.route.startsWith('/habit/:id/edit')) {
                const habit = state.pd.habits.get(Number(state.router.params.id))
                store.dispatch(actions.prospective.habit.copy(habit))
            }
            return res
        }
        default:
            return res
    }
}

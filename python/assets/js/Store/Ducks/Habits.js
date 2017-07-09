import { createActions, handleActions } from 'redux-actions'
import { Map, Record, Set } from 'immutable'

export const PeriodRecord = Record({
    start: 0,
    period: 0,
})

const ScheduleRecord = Record({
    start: 0,
    stop: null,
    weight: 0,
    periods: Set(),
})

class HabitRecord extends Record({
    happened_today: false,
    id: 'new',
    long_description: '',
    short_description: '',
    today_action_id: null,
    url: '',
    person: '',
    schedule: new ScheduleRecord(),
}) {
    toAPIObj(alsoDelete) {
        let map = this.toMap()
        if (alsoDelete !== undefined) {
            for (let key of alsoDelete) {
                map = map.delete(key)
            }
        }
        return map.delete('happened_today').delete('today_action_id').delete('url').toJS()
    }
}

const justNewHabit = {
    new: new HabitRecord(),
}

const defaultState = Map(justNewHabit)

const periodAction = (habitId, start, period) => ({
    habitId: habitId,
    period: new PeriodRecord({
        start: start,
        period: period,
    }),
})

export const actions = createActions({
    HABITS: {
        LOAD: async (apiClient, id) => {
            const response = await apiClient.listHabits(id)
            return response.results
        },
        NEW: async (apiClient, habit) => {
            const response = await apiClient.newHabit(habit.toAPIObj(['id']))
            return response
        },
        UPDATE: {
            LONG_DESCRIPTION: {
                SET: (habitId, desc) => ({
                    habitId: habitId,
                    desc: desc,
                }),
            },
            SHORT_DESCRIPTION: {
                SET: (habitId, desc) => ({
                    habitId: habitId,
                    desc: desc,
                }),
            },
            WEIGHT: {
                SET: (habitId, weight) => ({
                    habitId: habitId,
                    weight: weight,
                }),
            },
            SCHEDULE: {
                SET: periodAction,
                UNSET: periodAction,
                TOGGLE: periodAction,
            },
        },
        CLEAR: id => ({ id: id, }),
        SAVE: async (apiClient, habit) => {
            const response = await apiClient.updateHabit(habit.toAPIObj())
            return response
        },
    },
})

const setPeriod = (state, habitId, periodRecord) => (
    state.updateIn([habitId, 'schedule', 'periods'], periods => periods.add(periodRecord))
)

const unsetPeriod = (state, habitId, periodRecord) => (
    state.updateIn([habitId, 'schedule', 'periods'], periods => periods.delete(periodRecord))
)

export const reducer = handleActions({
    HABITS: {
        LOAD: (state, action) => {
            let out = defaultState
            console.log(action)
            for (let habit of action.payload) {
                const sRecord = new ScheduleRecord({
                    ...habit.schedule,
                    periods: Set(habit.schedule.periods.map((period) => new PeriodRecord(period))),
                })
                const hRecord = new HabitRecord({
                    ...habit,
                    schedule: sRecord,
                })
                out = out.set(habit.id, hRecord)
            }
            return out
        },
        NEW: (state, action) => {
            state.set(action.payload.id, action.payload)
        },
        UPDATE: {
            LONG_DESCRIPTION: {
                SET: (state, action) => {
                    const { habitId, desc } = action.payload
                    return (
                        state.updateIn([habitId], habit => habit.set('long_description', desc))
                    )
                }
            },
            SHORT_DESCRIPTION: {
                SET: (state, action) => {
                    const { habitId, desc } = action.payload
                    return (
                        state.updateIn([habitId], habit => habit.set('short_description', desc))
                    )
                }
            },
            WEIGHT: {
                SET: (state, action) => {
                    const id = action.payload.habitId
                    const weight = action.payload.weight
                    return (
                        state.updateIn([id, 'schedule'], schedule => schedule.set('weight', weight))
                    )
                },
            },
            SCHEDULE: {
                SET: (state, action) => setPeriod(state, action.payload.habitId, action.payload.period),
                UNSET: (state, action) => unsetPeriod(state, action.payload.habitId, action.payload.period),
                TOGGLE: (state, action) => {
                    console.log(action)
                    if (state.get(action.payload.habitId).schedule.periods.has(action.payload.period)) {
                        return unsetPeriod(state, action.payload.habitId, action.payload.period)
                    } else {
                        return setPeriod(state, action.payload.habitId, action.payload.period)
                    }
                },
            },
        },
        CLEAR: (state, action) => (
            state.updateIn([action.payload.id], () => new HabitRecord({id: action.payload.id}))
        ),
        SAVE: (state) => state,
    },
}, defaultState)

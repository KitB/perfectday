import { createActions, handleActions } from 'redux-actions'
import { Map, Record, List, Set } from 'immutable'

export const PeriodRecord = Record({
    start: 0,
    period: 0,
})

const ScheduleRecord = Record({
    start: 0,
    stop: null,
    weight: 0,
    periods: List(),
})

class HabitRecord extends Record({
    happened_today: false,
    id: 0,
    long_description: '',
    short_description: '',
    today_action_id: null,
    url: '',
    person: '',
    schedule: new ScheduleRecord(),
}) {
    toAPIObj() {
        return this.toMap().delete('happened_today').delete('today_action_id').delete('url').toJS()
    }
}

const defaultState = Map()

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
            const response = await apiClient.newHabit(habit.toAPIObj())
            return response
        },
        SCHEDULE: {
            SET: periodAction,
            UNSET: periodAction,
            TOGGLE: periodAction,
            SAVE: async (apiClient, habit) => {
                const response = await apiClient.updateHabit(habit.toAPIObj())
                return response
            }
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
            let out = Map()
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
        SCHEDULE: {
            SET: (state, action) => setPeriod(state, action.payload.habitId, action.payload.period),
            UNSET: (state, action) => unsetPeriod(state, action.payload.habitId, action.payload.period),
            TOGGLE: (state, action) => {
                if (state.get(action.payload.habitId).schedule.periods.has(action.payload.period)) {
                    return unsetPeriod(state, action.payload.habitId, action.payload.period)
                } else {
                    return setPeriod(state, action.payload.habitId, action.payload.period)
                }
            },
            SAVE: (state) => state,
        },
    },
}, defaultState)

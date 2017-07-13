import { createActions, handleActions } from 'redux-actions'
import { Map, Record, Set } from 'immutable'

export const PeriodRecord = Record({
    start: 0,
    period: 0,
})

export const ScheduleRecord = Record({
    start: 0,
    stop: null,
    weight: 0,
    periods: Set(),
})

export class HabitRecord extends Record({
    happened_today: false,
    id: null,
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
        CLEAR: id => ({ id: id, }),
        SAVE: async (apiClient, habit) => {
            const response = await apiClient.updateHabit(habit.toAPIObj())
            return response
        },
    },
})

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
        CLEAR: (state, action) => (
            state.updateIn([action.payload.id], () => new HabitRecord({id: action.payload.id}))
        ),
        SAVE: (state) => state,
    },
}, defaultState)

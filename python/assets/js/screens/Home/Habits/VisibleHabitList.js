import { connect, compose } from 'propCompose'
import HabitList from './HabitList'
import { actions } from 'Store/Ducks'

import { Push } from 'propMakers/Navigate'

const makeProps = (state, dispatch, previous) => ({
    onHabitClick: async (habit) => {
        const pd = state.pd.apiClient
        const fn = () => habit.happened_today ? pd.undoHabit(habit) : pd.doHabit(habit)

        await fn()
        return await dispatch(actions.habits.load(pd, state.pd.me.id))
    },
    onHabitSecondaryClick: (habitId) => previous.push(`/habit/${habitId}`),
    habits: state.pd.habits.filter(habit => habit.id !== null),
})

const VisibleHabitList = connect(
    compose(Push, makeProps)
)(HabitList)

export default VisibleHabitList

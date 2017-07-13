import { connect } from 'react-redux'
import HabitList from './HabitList'
import { actions } from 'Store/Ducks'
import { push } from 'redux-little-router'

const mapStateToProps = state => {
    return {
        habits: state.pd.habits.filter(habit => habit.id !== null),
        me: state.pd.me,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onHabitClick: async (habit, me) => {
            const pd = ownProps.apiClient
            const fn = () => habit.happened_today ? pd.undoHabit(habit) : pd.doHabit(habit)

            await fn()
            return await dispatch(actions.habits.load(pd, me.id))
        },
        onHabitSecondaryClick: (habitId) => {
            dispatch(push('/habit/' + habitId))
        }
    }
}

const VisibleHabitList = connect(
        mapStateToProps,
        mapDispatchToProps,
)(HabitList)

export default VisibleHabitList

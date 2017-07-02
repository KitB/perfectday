import { connect } from 'react-redux'
import HabitList from '../components/HabitList'
import { setHabits } from '../actions'
import { push } from 'redux-little-router'

const mapStateToProps = state => {
    return {
        habits: state.pd.habits,
        me: state.pd.me,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onHabitClick: (habit, me) => {
            const pd = ownProps.apiClient
            const fn = () => habit.happened_today ? pd.undoHabit(habit) : pd.doHabit(habit)
            fn().then(() => {
                pd.listHabits(me.id).then(listResponse => {
                    dispatch(setHabits(listResponse.results))
                })
            })
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

import { connect } from 'react-redux'
import HabitList from '../components/HabitList'
import { setHabits } from '../actions'

const mapStateToProps = state => {
    return {
        habits: state.habits,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onHabitChange: (habit, checked) => {
            const pd = ownProps.apiClient
            const fn = () => checked ? pd.doHabit(habit) : pd.undoHabit(habit)
            fn().then(() => {
                pd.listHabits(window.me.id).then(response => {
                    dispatch(setHabits(response.results))
                })
            })
        }
    }
}

const VisibleHabitList = connect(
        mapStateToProps,
        mapDispatchToProps,
)(HabitList)

export default VisibleHabitList

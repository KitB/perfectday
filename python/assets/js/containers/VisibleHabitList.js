import { connect } from 'react-redux'
import HabitList from '../components/HabitList'
import { setHabits } from '../actions'

const mapStateToProps = state => {
    return {
        habits: state.habits,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onHabitChange: (habit, checked) => {
            const fn = () => checked ? window.pd.doHabit(habit) : window.pd.undoHabit(habit)
            fn().then(() => {
                console.log(habit)
                window.pd.listHabits(window.me.id).then(response => {
                    console.log(response)
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

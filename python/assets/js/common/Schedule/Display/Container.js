import { connect } from 'react-redux'
import RawScheduleDisplay from './Component'

const mapStateToProps = (state) => {
    const id = Number(state.router.params.id)
    const habit = state.pd.habits.get(id)
    return ({
        habit: habit || {schedule: {}},
    })
}

export default connect(mapStateToProps)(RawScheduleDisplay)

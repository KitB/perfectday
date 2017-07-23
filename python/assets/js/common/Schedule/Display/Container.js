import { connect } from 'react-redux'
import RawScheduleDisplay from './Component'

import { HabitRecord } from 'Store/Ducks/Habits'

const mapStateToProps = (state) => {
    const id = Number(state.router.params.id)
    const habit = state.pd.habits.get(id)
    return ({
        habit: habit || new HabitRecord(),
    })
}

export default connect(mapStateToProps)(RawScheduleDisplay)

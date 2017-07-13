import { connect } from 'react-redux'

import { replace } from 'redux-little-router'

import { actions } from 'Store/Ducks'
import { PeriodRecord } from 'Store/Ducks/Habits'

import RawSchedule from './Component'

const mapStateToProps = (state) => {
    const habit = state.pd.prospectiveHabit
    return {
        habit: habit,
        periods: habit.schedule.periods,
        client: state.pd.apiClient,
        me: state.pd.me.id,
    }
}

const mapDispatchToProps = (dispatch) => ({
    toggle: (start, period) => (
        dispatch(actions.prospective.habit.update.schedule.toggle(start, period))
    ),
    go: loc => dispatch(replace(loc)),
})

const mergeProps = (stateProps, dispatchProps) => ({
    periods: stateProps.periods,
    hasDay: (day) => stateProps.periods.has(new PeriodRecord({start: day, period: 7})),
    toggleDay: day => dispatchProps.toggle(day, 7),
    togglePeriod: thing => thing,
    go: dispatchProps.go,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(RawSchedule)

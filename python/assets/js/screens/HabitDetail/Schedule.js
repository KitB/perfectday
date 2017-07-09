import { connect } from 'react-redux'
import { Set } from 'immutable'

import { goBack, push } from 'redux-little-router'

import { actions } from 'Store/Ducks'
import { PeriodRecord } from 'Store/Ducks/Habits'

import RawSchedule from 'common/Schedule'

const mapStateToProps = state => {
    const habitId = Number(state.router.params.id)
    const habit = state.pd.habits.get(habitId)
    let periods = Set()
    if (habit !== undefined) {
        periods = habit.schedule.periods
    }
    return {
        client: state.pd.apiClient,
        periods: periods,
        habit: habit,
        me: state.pd.me.id,
    }
}

const mapDispatchToProps = dispatch => ({
    toggle: (habitId, start, period) => dispatch(actions.habits.schedule.toggle(habitId, start, period)),
    onCancel: (apiClient, me) => {
        dispatch(actions.habits.load(apiClient, me))
        dispatch(goBack())
    },
    onSave: (apiClient, habit) => {
        dispatch(actions.habits.schedule.save(apiClient, habit))
        dispatch(goBack())
    },
    go: loc => dispatch(push(loc)),
})

const mergeProps = (stateProps, dispatchProps) => ({
    periods: stateProps.periods,
    hasDay: (day) => stateProps.periods.has(new PeriodRecord({start: day, period: 1})),
    onSave: () => dispatchProps.onSave(stateProps.client, stateProps.habit),
    onCancel: () => dispatchProps.onCancel(stateProps.client, stateProps.me),
    toggleDay: day => dispatchProps.toggle(stateProps.habit.id, day, 1),
    togglePeriod: thing => thing,
    go: dispatchProps.go,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(RawSchedule)

import { connect } from 'react-redux'
import { Set } from 'immutable'

import { goBack, push } from 'redux-little-router'

import { actions } from 'Store/Ducks'
import { PeriodRecord } from 'Store/Ducks/Habits'

import RawSchedule from './Component'

export const habitSelectors = {
    fromLocation: state => Number(state.router.params.id),
    const: value => () => value,
    newHabit: () => 'new',
}

const mapStateToProps = (state, ownProps) => {
    const habitId = ownProps.habitSelector(state)
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

export const onSaves = {
    sendUpdate:  dispatch => (apiClient, habit) => {
        dispatch(actions.habits.save(apiClient, habit))
        dispatch(goBack())
    },
    goBack: dispatch => () => {
        dispatch(goBack())
    }
}

export const onCancels = {
    loadHabits: dispatch => (apiClient, me) => {
        dispatch(actions.habits.load(apiClient, me))
        dispatch(goBack())
    },
    clearNew: dispatch => () => {
        dispatch(actions.habits.clear('new'))
        dispatch(goBack())
    },
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggle: (habitId, start, period) => (
        dispatch(actions.habits.update.schedule.toggle(habitId, start, period))
    ),
    onCancel: ownProps.onCancel(dispatch),
    onSave: ownProps.onSave(dispatch),
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

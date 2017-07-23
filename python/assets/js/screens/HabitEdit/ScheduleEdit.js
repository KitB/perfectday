import { connect, compose } from 'propCompose'

import { actions } from 'Store/Ducks'
import { PeriodRecord } from 'Store/Ducks/Habits'

import RawSchedule from 'components/ScheduleEdit'

import { prospectiveHabit } from 'propMakers/Habit'
import { Replace } from 'propMakers/Navigate'

const makeProps = (state, dispatch, previous) => {
    const periods = previous.habit.schedule.periods
    return {
        periods: periods,
        hasDay: day => periods.has(new PeriodRecord({start: day, period: 7})),
        toggleDay: day => dispatch(actions.prospective.habit.update.schedule.toggle(day, 7)),
        togglePeriod: thing => thing,
        go: previous.replace,
    }
}

export default connect(
    compose(prospectiveHabit, Replace, makeProps)
)(RawSchedule)

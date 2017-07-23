import React from 'react'
import PropTypes from 'prop-types'
import { connect, compose } from 'propCompose'

import IconButton from 'material-ui/IconButton'

import EditIcon from 'material-ui-icons/Edit'

import { BarHeader, BarTitle } from 'components'

import Back from 'containers/Back'
import { locationHabit } from 'propMakers/Habit'
import { Push } from 'propMakers/Navigate'

const RawHabitHeader = ({habit, goEdit}) => (
    <BarHeader>
        <Back />
        <BarTitle>
            {habit && habit.short_description || ''}
        </BarTitle>
        <IconButton color='contrast' onClick={() => goEdit(habit.id)}>
            <EditIcon />
        </IconButton>
    </BarHeader>
)

RawHabitHeader.propTypes = {
    habit: PropTypes.object,
    goEdit: PropTypes.func.isRequired,
}

const makeProps = (state, dispatch, previous) => ({
    goEdit: (id) => previous.push(`/habit/${id}/edit`),
})

const HabitHeader = connect(
    compose(locationHabit, Push, makeProps)
)(RawHabitHeader)

export default HabitHeader

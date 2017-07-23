import React from 'react'
import PropTypes from 'prop-types'
import { connect, compose } from 'propCompose'

import IconButton from 'material-ui/IconButton'
import SaveIcon from 'material-ui-icons/Done'

import { BarHeader, BarTitle } from 'components'
import Back from 'containers/Back'

import { actions } from 'Store/Ducks'
import { GoBack } from 'propMakers/Navigate'
import { prospectiveHabit } from 'propMakers/Habit'

const RawHabitHeader = ({habit, saveChanges}) => (
    <BarHeader>
        <Back />
        <BarTitle>
            Editing {habit && habit.short_description}
        </BarTitle>
        <IconButton color='contrast' onClick={saveChanges}>
            <SaveIcon />
        </IconButton>
    </BarHeader>
)

RawHabitHeader.propTypes = {
    habit: PropTypes.object.isRequired,
    saveChanges: PropTypes.func.isRequired,
}

const makeProps = (state, dispatch, previous) => ({
    saveChanges: async () => {
        previous.goBack()
        const me = state.pd.me
        await dispatch(actions.prospective.habit.save(state.pd.apiClient, previous.habit, me.url))
        dispatch(actions.habits.load(state.pd.apiClient, me.id))
    },
})

const HabitHeader = connect(
    compose(prospectiveHabit, GoBack, makeProps)
)(RawHabitHeader)

export default HabitHeader

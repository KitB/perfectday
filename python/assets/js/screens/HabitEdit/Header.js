import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { goBack } from 'redux-little-router'

import IconButton from 'material-ui/IconButton'
import SaveIcon from 'material-ui-icons/Done'

import { BarHeader, BarTitle } from 'common/components'
import Back from 'common/containers/Back'

import { actions } from 'Store/Ducks'

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

const mapStateToProps = state => {
    const id = state.router.params.id
    let habit = state.pd.habits.get(Number(id))
    return {
        habit: habit,
        getProspectiveHabit: () => state.pd.prospectiveHabit,
        apiClient: state.pd.apiClient,
        me: state.pd.me,
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveChanges: async (apiClient, habit, me) => {
        dispatch(goBack())
        await dispatch(actions.prospective.habit.save(apiClient, habit, me.url))
        dispatch(actions.habits.load(apiClient, me.id))
    },
})

const mergeProps = (stateProps, dispatchProps) => ({
    habit: stateProps.habit,
    saveChanges: () => dispatchProps.saveChanges(stateProps.apiClient, stateProps.getProspectiveHabit(), stateProps.me),
})

const HabitHeader = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(RawHabitHeader)

export default HabitHeader

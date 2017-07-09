import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { goBack } from 'redux-little-router'

import { actions } from 'Store/Ducks'
import { fabStyle } from 'commonStyles'
import { lightGreen } from 'material-ui/colors'

import Button from 'material-ui/Button'
import SaveIcon from 'material-ui-icons/Done'

const buttonStyle = {
    ...fabStyle,
    backgroundColor: lightGreen[500],
}

const RawSaveHabitFab = ({saveHabit}) => (
    <Button fab style={buttonStyle} onClick={saveHabit}>
        <SaveIcon />
    </Button>
)

RawSaveHabitFab.propTypes = {
    saveHabit: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    client: state.pd.apiClient,
    habit: state.pd.habits.get('new'),
    me: state.pd.me,
})

const mapDispatchToProps = (dispatch) => ({
    saveHabit: async (client, habit, me) => {
        dispatch(goBack())
        await dispatch(actions.habits.new(client, habit.set('person', me.url)))
        await dispatch(actions.habits.load(client, me.id))
    }
})

const mergeProps = (stateProps, dispatchProps) => ({
    saveHabit: () => dispatchProps.saveHabit(stateProps.client, stateProps.habit, stateProps.me),
})

const SaveHabitFab = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(RawSaveHabitFab)

export default SaveHabitFab

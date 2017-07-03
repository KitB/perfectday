import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'redux-little-router'

import AddIcon from 'material-ui-icons/Add'

import { fabStyle } from 'commonStyles'

import Button from 'material-ui/Button'

const RawAddHabitFab = ({onAddHabitLink}) => (
    <Button fab color='primary' onClick={onAddHabitLink} style={fabStyle}>
        <AddIcon />
    </Button>
)

RawAddHabitFab.propTypes = {
    onAddHabitLink: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
    onAddHabitLink: () => {
        dispatch(push('/newhabit'))
    }
})

const AddHabitFab = connect(
    undefined,
    mapDispatchToProps,
)(RawAddHabitFab)

export default AddHabitFab

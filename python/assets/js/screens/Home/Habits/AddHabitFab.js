import React from 'react'
import PropTypes from 'prop-types'
import { connect, compose } from 'propCompose'

import AddIcon from 'material-ui-icons/Add'

import { fabStyle } from 'commonStyles'

import Button from 'material-ui/Button'

import { Push } from 'propMakers/Navigate'

const RawAddHabitFab = ({onAddHabitLink}) => (
    <Button fab color='primary' onClick={onAddHabitLink} style={fabStyle}>
        <AddIcon />
    </Button>
)

RawAddHabitFab.propTypes = {
    onAddHabitLink: PropTypes.func.isRequired,
}

const makeProps = (state, dispatch, previous) => ({
    onAddHabitLink: () => previous.push('/habit/new/edit'),
})

const AddHabitFab = connect(
    compose(Push, makeProps)
)(RawAddHabitFab)

export default AddHabitFab

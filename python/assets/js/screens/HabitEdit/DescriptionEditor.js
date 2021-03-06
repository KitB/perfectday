import React from 'react'
import PropTypes from 'prop-types'
import { connect, compose } from 'propCompose'

import Card, { CardContent, CardHeader } from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import { actions } from 'Store/Ducks'

import { prospectiveHabit } from 'propMakers/Habit'

export const RawDescriptionEditor = ({ habit, onShortChange, onLongChange }) => (
    <Card>
        <CardHeader
            title='Description'
        />
        <CardContent>
            <TextField
                id='short_description'
                label='Short Description'
                onChange={(e) => onShortChange(e.target.value)}
                value={habit.short_description}
                marginForm
            />
            <TextField
                id='long_description'
                label='Long Description'
                onChange={(e) => onLongChange(e.target.value)}
                value={habit.long_description}
                multiline
                rows='2'
                fullWidth
                marginForm
            />
        </CardContent>
    </Card>
)

RawDescriptionEditor.propTypes = {
    habit: PropTypes.object.isRequired,
    onShortChange: PropTypes.func.isRequired,
    onLongChange: PropTypes.func.isRequired,
}

const makeProps = (state, dispatch) => ({
    onShortChange: (shortDesc) => dispatch(actions.prospective.habit.update.shortDescription.set(shortDesc)),
    onLongChange: (longDesc) => dispatch(actions.prospective.habit.update.longDescription.set(longDesc)),
})

export default connect(
    compose(prospectiveHabit, makeProps)
)(RawDescriptionEditor)

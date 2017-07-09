import React from 'react'
import PropTypes from 'prop-types'

import List, { ListItem, ListItemSecondaryAction, ListItemText, ListSubheader } from 'material-ui/List'
import Switch from 'material-ui/Switch'
import Button from 'material-ui/Button'

const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

const dayInts = [0, 1, 2, 3, 4, 5, 6,]

const doneButton = {
    float: 'right',
}

const cancelButton = {
    float: 'left',
}

const container = {
    overflow: 'auto',
}

const Week = ({hasDay, onSave, onCancel, toggleDay}) => {
    const items = dayInts.map(day => {
        return (
            <ListItem key={day}>
                <ListItemText primary={days[day]} />
                <ListItemSecondaryAction>
                    <Switch
                        onClick={() => toggleDay(day)}
                        checked={hasDay(day)}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        )
    })
    const subheader = <ListSubheader>Select Weekdays</ListSubheader>

    return (
        <div style={container}>
            <List dense subheader={subheader}>
                {items}
            </List>
            <Button raised dense style={cancelButton} color='accent' onClick={onCancel}>Cancel</Button>
            <Button raised dense style={doneButton} color='primary' onClick={onSave}>Save</Button>
        </div>
    )
}

Week.propTypes = {
    hasDay: PropTypes.func,
    toggleDay: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
}

export default Week

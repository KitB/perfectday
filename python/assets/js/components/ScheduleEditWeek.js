import React from 'react'
import PropTypes from 'prop-types'

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Switch from 'material-ui/Switch'
import { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'

import BackIcon from 'material-ui-icons/ArrowBack'

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

const container = {
    overflow: 'auto',
}

const Week = ({hasDay,  toggleDay, goBack}) => {
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
    return (
        <div>
            <CardHeader
                title='Schedule'
                subheader='Select Weekdays'
            />
            <CardContent style={container}>
                <List dense>
                    {items}
                </List>
            </CardContent>
            <CardActions>
                <IconButton onClick={goBack}>
                    <BackIcon />
                </IconButton>
            </CardActions>
        </div>
    )
}

Week.propTypes = {
    hasDay: PropTypes.func.isRequired,
    toggleDay: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
}

export default Week

import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import PropTypes from 'prop-types'

const Habit = ({ onClick, happened, text }) => (
    <ListItem dense button
              onClick={onClick}
              label={text}
    >
        <Checkbox checked={happened}
                  tabIndex='-1'
                  disableRipple
        />
        <ListItemText primary={text} />
    </ListItem>
)

Habit.propTypes = {
    onClick: PropTypes.func.isRequired,
    happened: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
}

export default Habit

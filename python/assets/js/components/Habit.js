import React from 'react'
import PropTypes from 'prop-types'

// MUI Components
import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'

import ChevronRight from 'material-ui-icons/ChevronRight'

const Habit = ({ onClick, onSecondaryClick, happened, text }) => (
    <ListItem dense IconButto n
              onClick={onClick}
              label={text}
    >
        <Checkbox checked={happened}
                  tabIndex='-1'
                  disableRipple
        />
        <ListItemText primary={text} />
        <ListItemSecondaryAction>
            <IconButton onClick={onSecondaryClick}>
                <ChevronRight />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
)

Habit.propTypes = {
    onClick: PropTypes.func.isRequired,
    onSecondaryClick: PropTypes.func.isRequired,
    happened: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
}

export default Habit

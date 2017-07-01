import React from 'react'
import PropTypes from 'prop-types'
import {List, ListItem} from 'material-ui/List'
import Habit from './Habit'

const HabitList = ({ habits, onHabitChange }) => (
    <List>
        {
            habits.map(habit => (
                <ListItem key={habit.id}>
                    <Habit happened={habit.happened_today}
                           text={habit.short_description}
                           onChange={(e, checked) => onHabitChange(habit, checked, e)}
                       />
                </ListItem>
            ))
        }
    </List>
)

HabitList.propTypes = {
    habits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            happened_today: PropTypes.bool.isRequired,
            short_description: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    onHabitChange: PropTypes.func.isRequired,
}

export default HabitList

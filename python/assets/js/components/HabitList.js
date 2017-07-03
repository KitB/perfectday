import React from 'react'
import PropTypes from 'prop-types'
import List from 'material-ui/List'
import Habit from './Habit'

const HabitList = ({ habits, onHabitClick, onHabitSecondaryClick, me }) => (
    <List>
        {
            Object.entries(habits).map(([key, habit]) => (
                <Habit key={key}
                       happened={habit.happened_today}
                       text={habit.short_description}
                       onClick={(e) => onHabitClick(habit, me, e)}
                       onSecondaryClick={() => onHabitSecondaryClick(habit.id)}
                       habitId={habit.id}
                   />
            ))
        }
    </List>
)

HabitList.propTypes = {
    habits: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            happened_today: PropTypes.bool.isRequired,
            short_description: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    onHabitClick: PropTypes.func.isRequired,
    onHabitSecondaryClick: PropTypes.func.isRequired,
    me: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
}

export default HabitList

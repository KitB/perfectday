import React from 'react'
import PropTypes from 'prop-types'
import List from 'material-ui/List'
import Habit from './Habit'

const HabitList = ({ habits, onHabitClick, me }) => (
    <List>
        {
            habits.map(habit => (
                <Habit key={habit.id}
                       happened={habit.happened_today}
                       text={habit.short_description}
                       onClick={(e) => onHabitClick(habit, me, e)}
                   />
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
    onHabitClick: PropTypes.func.isRequired,
    me: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
}

export default HabitList

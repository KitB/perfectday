import React from 'react'
import PropTypes from 'prop-types'
import List from 'material-ui/List'
import Habit from './Habit'

const HabitList = ({ habits, onHabitClick, onHabitSecondaryClick }) => {
    return (
        <List>
            {
            habits.entrySeq().map(([key, habit]) => (
                    <Habit key={key}
                        happened={habit.happened_today}
                        text={habit.short_description}
                        onClick={() => onHabitClick(habit)}
                        onSecondaryClick={() => onHabitSecondaryClick(habit.id)}
                        habitId={habit.id}
                    />
            ))
            }
        </List>
    )
}

HabitList.propTypes = {
    habits: PropTypes.object.isRequired,
    onHabitClick: PropTypes.func.isRequired,
    onHabitSecondaryClick: PropTypes.func.isRequired,
}

export default HabitList

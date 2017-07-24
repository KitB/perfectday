import React from 'react'
import PropTypes from 'prop-types'

import VisibleHabitList from './VisibleHabitList'
import AddHabitFab from './AddHabitFab'

const Habits = ({style}) => (
    <div style={style}>
        <VisibleHabitList />
        <AddHabitFab />
    </div>
)

Habits.propTypes = {
    style: PropTypes.object,
}

export default Habits

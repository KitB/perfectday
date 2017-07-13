import React from 'react'
import PropTypes from 'prop-types'

const ScheduleDisplay = ({habit}) => (
    <div>
        {habit.short_description}
    </div>
)

ScheduleDisplay.propTypes = {
    habit: PropTypes.object.isRequired,
}

export default ScheduleDisplay

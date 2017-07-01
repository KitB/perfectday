import React from 'react'
import CheckBox from 'material-ui/Checkbox'
import PropTypes from 'prop-types'

const Habit = ({ onChange, happened, text }) => (
    <CheckBox
    label={text}
    onCheck={onChange}
    checked={happened}
    />
)

Habit.propTypes = {
    onChange: PropTypes.func.isRequired,
    happened: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
}

export default Habit

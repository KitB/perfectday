import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'

import Header from 'common/Header'

const RawHabitHeader = ({habit}) => (
        <Header>
            <Typography type='display2'>
                {habit.short_description}
            </Typography>
            <Typography type='caption'>
                {habit.long_description}
            </Typography>
        </Header>
)

RawHabitHeader.propTypes = {
    habit: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
    const id = state.router.params.id
    let habit = state.pd.habits.get(Number(id))
    if (habit === undefined) {
        habit = {
            short_description: '',
            long_description: '',
        }
    }
    return {
        habit: habit,
    }
}

const HabitHeader = connect(
    mapStateToProps,
)(RawHabitHeader)

export default HabitHeader

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { push } from 'redux-little-router'

import IconButton from 'material-ui/IconButton'

import EditIcon from 'material-ui-icons/Edit'

import { BarHeader, BarTitle } from 'common/components'
import ShortDescription from 'common/containers/habit/Short'
import Back from 'common/containers/Back'

const RawHabitHeader = ({habit, goEdit}) => (
    <BarHeader>
        <Back />
        <BarTitle>
            <ShortDescription habit={habit} />
        </BarTitle>
        <IconButton color='contrast' onClick={() => goEdit(habit.id)}>
            <EditIcon />
        </IconButton>
    </BarHeader>
)

RawHabitHeader.propTypes = {
    habit: PropTypes.object,
    goEdit: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    const id = state.router.params.id
    let habit = state.pd.habits.get(Number(id))
    return {
        habit: habit,
    }
}

const mapDispatchToProps = (dispatch) => ({
    goEdit: (id) => dispatch(push(`/habit/${id}/edit`)),
})

const HabitHeader = connect(
    mapStateToProps,
    mapDispatchToProps,
)(RawHabitHeader)

export default HabitHeader

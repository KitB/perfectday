import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { HabitRecord } from 'Store/Ducks/Habits'

import Card, { CardHeader } from 'material-ui/Card'

const RawDescriptions = ({ longDesc, shortDesc }) => (
    <Card>
        <CardHeader
            title={shortDesc}
            subheader={longDesc}
        />
    </Card>
)

RawDescriptions.propTypes = {
    shortDesc: PropTypes.string.isRequired,
    longDesc: PropTypes.string.isRequired,
}

const mapStateToProps = state => {
    const id = Number(state.router.params.id)
    const habit = state.pd.habits.get(id) || new HabitRecord()
    return {
        shortDesc: habit.short_description,
        longDesc: habit.long_description,
    }
}

export default connect(mapStateToProps)(RawDescriptions)

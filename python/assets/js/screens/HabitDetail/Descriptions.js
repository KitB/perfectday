import React from 'react'
import PropTypes from 'prop-types'

import { connect, compose } from 'propCompose'
import { locationHabit } from 'propMakers/Habit'

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

const makeProps = (state, dispatch, previous) => ({
    shortDesc: previous.habit.short_description,
    longDesc: previous.habit.long_description,
})

export default connect(compose(locationHabit, makeProps))(RawDescriptions)

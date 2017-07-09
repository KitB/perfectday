import React from 'react'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

import { Fragment } from 'redux-little-router'

import Select from './Select'
import Week from './Week'


const paper = {
    padding: '2vw',
    position: 'relative',
}


const weekly = 'schedule-weekly'
const periodic = 'schedule-periodic'

const isWeekly = location => location.hash === '#' + weekly
const isPeriodic = location => location.hash === '#' + periodic


const Schedule = ({periods, hasDay, onSave, onCancel, toggleDay, togglePeriod, go}) => (
    <Paper style={paper} elevation={4}>
        <Fragment forRoute='/' withConditions={location => {
            console.log(isWeekly(location), isPeriodic(location))
            const out = !isWeekly(location) && !isPeriodic(location)
            console.log('Condition check: ', location, 'Showing?: ', out)
            return out
        }}>
        <Select goWeekly={() => go({hash: weekly})} goPeriodic={() => go({hash: periodic})} />
        </Fragment>
        <Fragment forRoute='/' withConditions={isWeekly}>
            <Week hasDay={hasDay} onSave={onSave} onCancel={onCancel} toggleDay={toggleDay} />
        </Fragment>
        <Fragment forRoute='/' withConditions={isPeriodic}>
            <Typography periods={periods} togglePeriod={togglePeriod} type='body1'>By start and interval</Typography>
        </Fragment>
    </Paper>
)

Schedule.propTypes = {
    periods: PropTypes.object,
    hasDay: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    toggleDay: PropTypes.func,
    togglePeriod: PropTypes.func,
    go: PropTypes.func,
}

export default Schedule

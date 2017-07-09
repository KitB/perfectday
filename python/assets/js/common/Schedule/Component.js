import React from 'react'
import PropTypes from 'prop-types'

import Typography from 'material-ui/Typography'

import { Fragment } from 'redux-little-router'

import Select from './Select'
import Week from './Week'


const weekly = 'schedule-weekly'
const periodic = 'schedule-periodic'

const isWeekly = location => location.hash === '#' + weekly
const isPeriodic = location => location.hash === '#' + periodic


const Schedule = ({periods, hasDay, onSave, onCancel, toggleDay, togglePeriod, go}) => (
    <div>
        <Fragment forRoute='/' withConditions={location => {
            const out = !isWeekly(location) && !isPeriodic(location)
            console.log('Condition check: ', location)
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
    </div>
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

import React from 'react'
import PropTypes from 'prop-types'

import Typography from 'material-ui/Typography'
import Card, {  } from 'material-ui/Card'

import { Fragment } from 'redux-little-router'

import Select from './Select'
import Week from './Week'


const weekly = 'schedule-weekly'
const periodic = 'schedule-periodic'

const isWeekly = location => location.hash === '#' + weekly
const isPeriodic = location => location.hash === '#' + periodic


const Schedule = ({periods, hasDay, toggleDay, togglePeriod, go}) => (
    <Card>
        <Fragment forRoute='/' withConditions={location => {
            const out = !isWeekly(location) && !isPeriodic(location)
            return out
        }}>
            <Select goWeekly={() => go({hash: weekly})} goPeriodic={() => go({hash: periodic})} />
        </Fragment>
        <Fragment forRoute='/' withConditions={isWeekly}>
            <Week hasDay={hasDay} toggleDay={toggleDay} goBack={() => go({hash: ''})} />
        </Fragment>
        <Fragment forRoute='/' withConditions={isPeriodic}>
            <Typography periods={periods} togglePeriod={togglePeriod} type='body1'>By start and interval</Typography>
        </Fragment>
    </Card>
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

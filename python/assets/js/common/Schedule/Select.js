import React from 'react'
import PropTypes from 'prop-types'

import Button from 'material-ui/Button'


const leftButton = {
    display: 'inline-block',
    width: '50%',
    position: 'relative',
    left: 0,
}

const rightButton = {
    display: 'inline-block',
    width: '50%',
    position: 'relative',
    right: 0,
}

const button = {
    width: '100%',
}

const container = {
    alignVertical: 'middle',
}


const Select = ({goWeekly, goPeriodic}) => (
    <div style={container}>
        <div style={leftButton}>
            <Button style={button} onClick={goWeekly}>By day of week</Button>
        </div>
        <div style={rightButton}>
            <Button style={button} onClick={goPeriodic}>By period</Button>
        </div>
    </div>
)

Select.propTypes = {
    goWeekly: PropTypes.func.isRequired,
    goPeriodic: PropTypes.func.isRequired,
}

export default Select

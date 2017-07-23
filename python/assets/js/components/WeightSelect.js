import React from 'react'
import PropTypes from 'prop-types'

import Typography from 'material-ui/Typography'

import 'react-mdl/extra/material.css'
import 'react-mdl/extra/material.js'

import { centerVert } from 'commonStyles'

import { Slider } from 'react-mdl'

const containerDiv = {
    ...centerVert,
    verticalAlign: 'middle',
    width: '100%',
    overflow: 'auto',
}

const sliderDiv = {
    width: '60%',
    float: 'left',
}

const displayDiv = {
    width: '30%',
    float: 'right',
    right: '0',
    textAlign: 'center',
    boxSizing: 'border-box',
}

const WeightSelect = ({onChange, weight}) => (
    <div style={containerDiv}>
        <div style={sliderDiv}>
            <Slider
                min={0}
                max={4}
                defaultValue={0}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
        <div style={displayDiv}>
            <Typography type='body1'>{weight}</Typography>
        </div>
    </div>
)

WeightSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    weight: PropTypes.number.isRequired,
}

export default WeightSelect

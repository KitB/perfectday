import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'material-ui/IconButton'

import BackIcon from 'material-ui-icons/ArrowBack'

const BarBack = ({goBack}) => (
    <IconButton color='contrast' onClick={goBack}>
        <BackIcon />
    </IconButton>
)

BarBack.propTypes = {
    goBack: PropTypes.func.isRequired,
}

export default BarBack

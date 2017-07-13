import React from 'react'
import PropTypes from 'prop-types'

const Text = ({ value }) => (
    <div>
        {value}
    </div>
)

Text.propTypes = {
    value: PropTypes.string.isRequired,
}

export default Text

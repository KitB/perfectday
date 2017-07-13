import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import mapStateToProps from './mapper'

const ShortDescription = ({habit}) => (
    <div>
        {habit.short_description}
    </div>
)

ShortDescription.propTypes = {
    habit: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(ShortDescription)

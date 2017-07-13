import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import mapStateToProps from './mapper'

const LongDescription = ({habit}) => (
    <div>
        {habit.long_description}
    </div>
)

LongDescription.propTypes = {
    habit: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(LongDescription)

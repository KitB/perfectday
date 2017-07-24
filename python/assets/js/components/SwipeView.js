import React from 'react'
import PropTypes from 'prop-types'
import childrenPropType from 'react-children-proptype'

import SwipeableViews from 'react-swipeable-views'

const SwipeView = ({ index, onChangeIndex, children }) => (
    <SwipeableViews
        index={index}
        onChangeIndex={onChangeIndex}
    >
        {children}
    </SwipeableViews>
)

SwipeView.propTypes = {
    index: PropTypes.number.isRequired,
    onChangeIndex: PropTypes.func.isRequired,
    children: childrenPropType,
}

export default SwipeView

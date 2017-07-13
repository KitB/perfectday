import React from 'react'
import childrenPropType from 'react-children-proptype'

import { fullScreen } from 'commonStyles'

const Screen = ({ children }) => (
    <div style={fullScreen}>
        {children}
    </div>
)

Screen.propTypes = {
    children: childrenPropType,
}

export default Screen

import React from 'react'
import childrenPropType from 'react-children-proptype'

import { padded } from 'commonStyles'

const Pane = ({children}) => (
    <div style={padded}>
        {children}
    </div>
)

Pane.propTypes = {
    children: childrenPropType,
}

export default Pane

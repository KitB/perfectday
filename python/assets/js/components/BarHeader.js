import React from 'react'
import childrenPropType from 'react-children-proptype'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

const appBarStyle = {
    position: 'static', // Stop it obscuring stuff
}

const BarHeader = ({children}) => (
    <AppBar style={appBarStyle}>
        <Toolbar>
            {children}
        </Toolbar>
    </AppBar>
)

BarHeader.propTypes = {
    children: childrenPropType,
}

export default BarHeader

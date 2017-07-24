// React
import React from 'react'
import PropTypes from 'prop-types'
import childrenPropType from 'react-children-proptype'

// MUI meta
import { withStyles, createStyleSheet } from 'material-ui/styles'

// Components
import AppBar from 'material-ui/AppBar'

const styleSheet = createStyleSheet('PaperSheet', theme => ({
    header: {
        position: 'relative',
        background: theme.palette.primary[500],
        height: '30vh',
    },
}))


const Header = ({classes, children}) => (
    <AppBar className={classes.header} square={true} elevation={4}>
        {children}
    </AppBar>
)

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    children: childrenPropType,
}

export default withStyles(styleSheet)(Header)

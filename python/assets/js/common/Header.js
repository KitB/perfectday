// React
import React from 'react'
import PropTypes from 'prop-types'

// MUI meta
import { withStyles, createStyleSheet } from 'material-ui/styles'

// Components
import Paper from 'material-ui/Paper'

// Other stuff
import { centerVert } from '../commonStyles'

const horizPad = '8vw'

const styleSheet = createStyleSheet('PaperSheet', theme => ({
    header: {
        background: theme.palette.primary[500],
        height: '30vh',
        paddingLeft: horizPad,
        paddingRight: horizPad,
    },
}))


const Header = ({classes, children}) => (
    <Paper className={classes.header} square={true} elevation={4}>
        <div style={centerVert}>
            {children}
        </div>
    </Paper>
)

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
}

export default withStyles(styleSheet)(Header)

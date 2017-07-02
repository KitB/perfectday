// React
import React from 'react'
import PropTypes from 'prop-types'

// MUI meta
import { withStyles, createStyleSheet } from 'material-ui/styles'

// Components
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

// Active containers
import DisplayWorth from '../containers/DisplayWorth'
import DisplayAvatar from '../containers/DisplayAvatar'

const horizPad = '8vw'

const centerVert = {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
}

const styleSheet = createStyleSheet('PaperSheet', theme => ({
    header: {
        background: theme.palette.primary[500],
        height: '30vh',
        paddingLeft: horizPad,
        paddingRight: horizPad,
    },
    pdContainer: {
        float: 'right',
        width: '50%',
        right: '0',
        textAlign: 'center',
        ...centerVert,
    },
    avatarContainer: {
        float: 'left',
        width: '50%',
        paddingRight: horizPad,
        boxSizing: 'border-box',
        textAlign: 'center',
        ...centerVert,
    },
}))


const Header = ({classes}) => (
    <Paper className={classes.header} square={true} elevation={4}>
        <div className={classes.avatarContainer}>
            <DisplayAvatar />
        </div>
        <div className={classes.pdContainer}>
            <Typography type='display3'>
                <DisplayWorth />
            </Typography>
        </div>
    </Paper>
)

Header.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styleSheet)(Header)

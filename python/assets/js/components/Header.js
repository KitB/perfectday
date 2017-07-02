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

const styleSheet = createStyleSheet('PaperSheet', theme => ({
    header: {
        background: theme.palette.primary[500],
        height: '30vh',
    },
    pd_container: {
        float: 'right',
        paddingRight: '8vw',
        position: 'relative',
        top: '50%',
        right: '0',
        transform: 'translateY(-50%)',
    },
}))

const Header = ({classes}) => (
    <Paper className={classes.header} square={true} elevation={4}>
        <div className={classes.pd_container}>
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

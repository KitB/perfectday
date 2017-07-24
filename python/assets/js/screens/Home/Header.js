// React
import React from 'react'

// Components
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
import GenHeader from 'components/Header'

// Active containers
import DisplayWorth from './DisplayWorth'
import DisplayAvatar from './DisplayAvatar'

// Other local
import { centerVert } from 'commonStyles'


const classes = {
    worth: {
        float: 'right',
        right: '0',
        textAlign: 'center',
        flex: 1,
        //...centerVert,
    },
    avatar: {
        float: 'left',
        flex: 1,
        boxSizing: 'border-box',
        textAlign: 'center',
        //...centerVert,
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        ...centerVert,
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    }
}


const Header = () => (
    <GenHeader>
        <div style={classes.toolbar}>
            <div style={classes.avatar}>
                <DisplayAvatar />
            </div>
            <Typography type='display1' color='inherit' style={classes.worth}>
                <DisplayWorth />
            </Typography>
        </div>
        <div style={classes.tabBar}>
            <Tabs
                index={0}
                fullWidth
            >
                <Tab label='Habits' />
                <Tab label='Rewards' />
            </Tabs>
        </div>
    </GenHeader>
)

export default Header

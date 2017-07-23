// React
import React from 'react'

// Components
import Typography from 'material-ui/Typography'
import GenHeader from 'components/Header'

// Active containers
import DisplayWorth from './DisplayWorth'
import DisplayAvatar from './DisplayAvatar'


const classes = {
    worth: {
        float: 'right',
        width: '50%',
        right: '0',
        textAlign: 'center',
        //...centerVert,
    },
    avatar: {
        float: 'left',
        width: '50%',
        boxSizing: 'border-box',
        textAlign: 'center',
        //...centerVert,
    },
}


const Header = () => (
    <GenHeader>
            <DisplayAvatar style={classes.avatar}/>
            <Typography type='display1' style={classes.worth}>
                <DisplayWorth />
            </Typography>
    </GenHeader>
)

export default Header

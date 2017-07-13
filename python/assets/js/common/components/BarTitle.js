import React from 'react'
import childrenPropType from 'react-children-proptype'

import Typography from 'material-ui/Typography'

const BarTitle = ({children}) => (
    <Typography color='inherit' type='title' style={{flex: 1}}>
        {children}
    </Typography>
)

BarTitle.propTypes = {
    children: childrenPropType,
}

export default BarTitle

import React from 'react'
import PropTypes from 'prop-types'
import Tabs, { Tab } from 'material-ui/Tabs'

const TabBar = ({ index, onChange, tabs }) => (
    <Tabs
        index={index}
        onChange={onChange}
        fullWidth
    >
        {tabs.map(tab => <Tab key={tab.index} label={tab.label} />)}
    </Tabs>

)

TabBar.propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            index: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default TabBar

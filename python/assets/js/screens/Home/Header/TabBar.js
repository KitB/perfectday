import { connect, compose } from 'propCompose'
import TabBar from 'components/TabBar'

import { Push } from 'propMakers/Navigate'

const makeProps = (state, dispatch, previous, ownProps) => {
    const tabs = ownProps.tabs
    const currentTab = tabs.find(e => e.route == state.router.route)
    const arrayTabs = Object.values(tabs).sort((a, b) => a.index - b.index)
    return {
        index: currentTab.index,
        tabs: arrayTabs,
        onChange: (e, index) => {
            const tab = arrayTabs[index]
            previous.push(tab.route)
        },
    }
}

export default connect(compose(Push, makeProps))(TabBar)

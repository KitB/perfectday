import { connect, compose } from 'propCompose'
import SwipeView from 'components/SwipeView'

import { Push } from 'propMakers/Navigate'

const makeProps = (state, dispatch, previous, ownProps) => {
    const tabs = ownProps.tabs
    const currentTab = tabs.find(e => e.route == state.router.route)
    const arrayTabs = Object.values(tabs).sort((a, b) => a.index - b.index)
    return {
        index: currentTab.index,
        onChangeIndex: index => {
            const tab = arrayTabs[index]
            previous.push(tab.route)
        },
        children: ownProps.children,
    }
}

export default connect(compose(Push, makeProps))(SwipeView)

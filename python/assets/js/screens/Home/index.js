import React from 'react'

import { fullScreen } from 'commonStyles'

import Header from './Header'
import Habits from './Habits'
import Rewards from './Rewards'
import SwipeView from './SwipeView'


const tabs = [
    {index: 0, route: '/home/habits', label: 'Habits'},
    {index: 1, route: '/home/rewards', label: 'Rewards'},
]

const pane = {
    height: '70vh', // 100 - 30; I am uncomfortable with this.
}

const Home = () => (
    <div style={fullScreen}>
        <Header tabs={tabs} />
        <SwipeView tabs={tabs}>
            <Habits style={pane} />
            <Rewards style={pane} />
        </SwipeView>
    </div>
)

export default Home

import React from 'react'

import { fullScreen } from 'commonStyles'

import Header from './Header'
import VisibleHabitList from './VisibleHabitList'
import AddHabitFab from './AddHabitFab'


const Home = () => (
    <div style={{...fullScreen}}>
        <Header />
        <VisibleHabitList />
        <AddHabitFab />
    </div>
)

export default Home

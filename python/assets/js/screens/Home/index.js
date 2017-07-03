import React from 'react'
import PropTypes from 'prop-types'

import { fullScreen } from 'commonStyles'

import Header from './Header'
import VisibleHabitList from './VisibleHabitList'
import AddHabitFab from './AddHabitFab'

import PerfectDay from 'PD'


const Home = ({apiClient}) => (
    <div style={{...fullScreen}}>
        <Header />
        <VisibleHabitList apiClient={apiClient} />
        <AddHabitFab />
    </div>
)
Home.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay).isRequired,
}

export default Home

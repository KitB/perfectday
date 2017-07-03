// Libraries
import React from 'react'
import PropTypes from 'prop-types'
import { Fragment } from 'redux-little-router'

import Home from 'screens/Home'
import HabitDetail from 'screens/HabitDetail'

// Components
import Header from 'common/Header'

// Extra fluff
import PerfectDay from 'PD'
import { fullScreen } from 'commonStyles'



const AddHabit = () => (
    <div style={{...fullScreen}}>
        <Header />
    </div>
)


const App = ({apiClient}) => (
    <div style={{...fullScreen}}>
        <Fragment forRoute='/home/'>
            <Home apiClient={apiClient} />
        </Fragment>
        <Fragment forRoute='/habit/:id'>
            <HabitDetail />
        </Fragment>
        <Fragment forRoute='/newhabit'>
            <AddHabit />
        </Fragment>
    </div>
)

App.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay).isRequired,
}

export default App

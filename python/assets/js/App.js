// Libraries
import React from 'react'
import PropTypes from 'prop-types'
import { Fragment } from 'redux-little-router'

// Screens
import NewHabit from 'screens/NewHabit'
import Home from 'screens/Home'
import HabitDetail from 'screens/HabitDetail'

// Extra fluff
import PerfectDay from 'PD'
import { fullScreen } from 'commonStyles'


const App = ({apiClient}) => (
    <div style={{...fullScreen}}>
        <Fragment forRoute='/home/'>
            <Home apiClient={apiClient} />
        </Fragment>
        <Fragment forRoute='/habit/:id'>
            <HabitDetail />
        </Fragment>
        <Fragment forRoute='/newhabit'>
            <NewHabit />
        </Fragment>
    </div>
)

App.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay).isRequired,
}

export default App

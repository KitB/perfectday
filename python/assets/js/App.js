// Libraries
import React from 'react'
import PropTypes from 'prop-types'
import { Fragment } from 'redux-little-router'

// Screens
import Home from 'screens/Home'
import HabitDetail from 'screens/HabitDetail'
import HabitEdit from 'screens/HabitEdit'

// Extra fluff
import PerfectDay from 'PD'
import { fullScreen } from 'commonStyles'


const App = () => (
    <div style={{...fullScreen}}>
        <Fragment forRoute='/home'>
            <Fragment forRoute='/habits'>
                <Home />
            </Fragment>
        </Fragment>
        <Fragment forRoute='/habit/:id'>
            <div>
                <Fragment forRoute='/edit'>
                    <HabitEdit />
                </Fragment>
                <Fragment forNoMatch>
                    <HabitDetail />
                </Fragment>
            </div>
        </Fragment>
    </div>
)

export default App

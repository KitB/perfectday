// Libraries
import React from 'react'
import { Fragment } from 'redux-little-router'

// Screens
import Home from 'screens/Home'
import HabitDetail from 'screens/HabitDetail'
import HabitEdit from 'screens/HabitEdit'

// Extra fluff
import { fullScreen } from 'commonStyles'


const App = () => (
    <div style={{...fullScreen}}>
        <Fragment forRoute='/home'>
            <Home />
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

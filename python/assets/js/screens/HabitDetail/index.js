import React from 'react'
import Header from './Header'
import Schedule from './Schedule'

import { fullScreen, padded } from 'commonStyles'

const Habit = () => (
    <div style={{...fullScreen}}>
        <Header />
        <div style={{...padded}}>
            <Schedule />
        </div>
    </div>
)

export default Habit
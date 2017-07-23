import React from 'react'

import Header from './Header'
import Descriptions from './Descriptions'
import ScheduleDisplay from './ScheduleDisplay'

import { BodyPane, Screen, Padding } from 'components'

const Habit = () => (
    <Screen>
        <Header />
        <BodyPane>
            <Descriptions />
            <Padding />
            <ScheduleDisplay />
        </BodyPane>
    </Screen>
)

export default Habit

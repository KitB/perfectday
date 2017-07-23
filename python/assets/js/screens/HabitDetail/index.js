import React from 'react'

import Header from './Header'
import Descriptions from './Descriptions'
import { ScheduleDisplay } from 'common/Schedule'

import { BodyPane, Screen, Padding } from 'common/components'

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

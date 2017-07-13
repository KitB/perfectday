import React from 'react'

import Paper from 'material-ui/Paper'

import Header from './Header'
import { ScheduleDisplay } from 'common/Schedule'

import { BodyPane, Screen } from 'common/components'

const paper = {
    padding: '2vw',
    position: 'relative',
}

const Habit = () => (
    <Screen>
        <Header />
        <BodyPane>
            <Paper style={paper} elevation={4}>
                <ScheduleDisplay />
            </Paper>
        </BodyPane>
    </Screen>
)

export default Habit

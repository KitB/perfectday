import React from 'react'

import Paper from 'material-ui/Paper'

import { fullScreen, padded } from 'commonStyles'

import Header from './Header'
import Schedule, { habitSelectors, onSaves, onCancels } from 'common/Schedule'

const paper = {
    padding: '2vw',
    position: 'relative',
}

const Habit = () => (
    <div style={{...fullScreen}}>
        <Header />
        <div style={{...padded}}>
            <Paper style={paper} elevation={4}>
                <Schedule habitSelector={habitSelectors.fromLocation}
                          onSave={onSaves.sendUpdate}
                          onCancel={onCancels.loadHabits}
                />
            </Paper>
        </div>
    </div>
)

export default Habit

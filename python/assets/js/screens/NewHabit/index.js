import React from 'react'

import Card, { CardContent } from 'material-ui/Card'

import { fullScreen, padded } from 'commonStyles'

import { Edit } from 'common/Schedule'

import Header from './Header'
import WeightSelect from './Weight'
import SaveHabitFab from './SaveHabit'

const weightCard = {
    height: '2vh',
}

const padding = {
    height: '1.5vh',
}

const Padding = () => <div style={padding} />

const NewHabit = () => (
    <div style={{...fullScreen}}>
        <Header />
        <div style={{...padded}}>
            <Card>
                <CardContent>
                    <Edit.Schedule habitSelector={Edit.habitSelectors.newHabit}
                                   onSave={Edit.onSaves.goBack}
                                   onCancel={Edit.onCancels.clearNew}
                    />
                </CardContent>
            </Card>
            <Padding />
            <Card>
                <CardContent  style={weightCard}>
                    <WeightSelect />
                </CardContent>
            </Card>
        </div>
        <SaveHabitFab />
    </div>
)

export default NewHabit

import React from 'react'

import Header from './Header'
import DescriptionEditor from './DescriptionEditor'

import { Screen, BodyPane } from 'common/components'
import { ScheduleEditor } from 'common/Schedule'

const padding = {
    height: '1.5vh',
}

const Padding = () => <div style={padding} />

const HabitEdit = () => (
    <Screen>
        <Header />
        <BodyPane>
            <DescriptionEditor />
            <Padding />
            <ScheduleEditor />
        </BodyPane>
    </Screen>
)

export default HabitEdit

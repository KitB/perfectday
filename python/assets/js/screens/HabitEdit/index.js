import React from 'react'

import Header from './Header'
import DescriptionEditor from './DescriptionEditor'

import { Screen, BodyPane, Padding } from 'common/components'
import { ScheduleEditor } from 'common/Schedule'

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

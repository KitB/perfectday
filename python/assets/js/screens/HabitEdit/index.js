import React from 'react'

import Header from './Header'
import DescriptionEditor from './DescriptionEditor'

import { Screen, BodyPane, Padding } from 'components'
import ScheduleEdit from './ScheduleEdit'

const HabitEdit = () => (
    <Screen>
        <Header />
        <BodyPane>
            <DescriptionEditor />
            <Padding />
            <ScheduleEdit />
        </BodyPane>
    </Screen>
)

export default HabitEdit

import React from 'react'
import PropTypes from 'prop-types'

import Card, { CardHeader, CardContent } from 'material-ui/Card'
import List, { ListItem, ListItemText } from 'material-ui/List'

const intdWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const periodText = (period, start) => {
    const adjustedStart = period.start + start
    if (period.period === 7) {
        // Weekly
        const weekday = intdWeekdays[adjustedStart % 7]
        return `Every ${weekday}`
    } else {
        return `Every ${period.period} days, offset ${period.start}`
    }
}

const PeriodDisplay = ({period, start}) => (
    <ListItem>
        <ListItemText
            primary={periodText(period, start)}
        />
    </ListItem>
)

PeriodDisplay.propTypes = {
    period: PropTypes.object.isRequired,
    start: PropTypes.number.isRequired,
}

const ScheduleDisplay = ({habit}) => (
    <Card>
        <CardHeader subheader='Schedule' />
        <CardContent>
            <List dense>
                {
                    habit.schedule.periods.valueSeq().map((period) => (
                    <PeriodDisplay
                        key={period}
                        period={period}
                        start={habit.schedule.start}
                    />
                    ))
                }
            </List>
        </CardContent>
    </Card>
)

ScheduleDisplay.propTypes = {
    habit: PropTypes.object.isRequired,
}

export default ScheduleDisplay

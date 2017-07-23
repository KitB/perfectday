import { connect } from 'propCompose'
import RawScheduleDisplay from 'components/ScheduleDisplay'

import { locationHabit } from 'propMakers/Habit'

export default connect(locationHabit)(RawScheduleDisplay)

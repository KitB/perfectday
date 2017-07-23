import { connect } from 'propCompose'

import { GoBack } from 'propMakers/Navigate'

import BarBack from 'components/BarBack'

export default connect(GoBack)(BarBack)

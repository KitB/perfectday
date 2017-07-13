import { connect } from 'react-redux'
import { goBack } from 'redux-little-router'

import BarBack from 'common/components/BarBack'

const mapDispatchToProps = (dispatch) => ({
    goBack: () => dispatch(goBack()),
})

export default connect(undefined, mapDispatchToProps)(BarBack)

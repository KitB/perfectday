import { connect } from 'react-redux'
import RawSchedule from 'common/Schedule'

const mapStateToProps = state => {
    return {
        client: state.pd.apiClient,
    }
}

const mapDispatchToProps = dispatch => ({

})

const mergeProps = (stateProps, dispatchProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(RawSchedule)

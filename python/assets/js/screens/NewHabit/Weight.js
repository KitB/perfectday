import { connect } from 'react-redux'

import { actions } from 'Store/Ducks'

import RawWeightSelect from 'common/WeightSelect'

const mapStateToProps = (state) => ({
    weight: state.pd.habits.get('new').schedule.weight,
})

const mapDispatchToProps = (dispatch) => ({
    onChange: (weight) => dispatch(actions.habits.update.weight.set('new', weight)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RawWeightSelect)

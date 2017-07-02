import { connect } from 'react-redux'
import Currency from '../components/Currency'

const mapStateToProps = state => {
  return {
    value: state.pd.me.worth,
  }
}

const DisplayWorth = connect(
  mapStateToProps,
)(Currency)

export default DisplayWorth

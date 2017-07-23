import { connect } from 'propCompose'
import Currency from 'components/Currency'

const makeProps = state => ({
    value: state.pd.me.worth,
})

const DisplayWorth = connect(
  makeProps,
)(Currency)

export default DisplayWorth

import { connect } from 'propCompose'
import Avatar from 'components/Avatar'

const makeProps = state => ({
  email: state.pd.me.user.email,
})

const DisplayAvatar = connect(
  makeProps
)(Avatar)

export default DisplayAvatar

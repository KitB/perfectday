import { connect } from 'react-redux'
import Avatar from '../components/Avatar'

const mapStateToProps = state => ({
  email: state.pd.me.user.email,
})

const DisplayAvatar = connect(
  mapStateToProps
)(Avatar)

export default DisplayAvatar

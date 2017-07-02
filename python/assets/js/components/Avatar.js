import React from 'react'
import PropTypes from 'prop-types'
import gravatar from 'gravatar'

import MAvatar from 'material-ui/Avatar'


const Avatar = ({email, size}) => {
  const avatarStyle = {
    width: size,
    height: size,
    display: 'inline-block',
  }
  const gravOpts = {
    s: '200',
  }
  return (
    <MAvatar src={gravatar.url(email, gravOpts)} style={avatarStyle} />
  )
}

Avatar.propTypes = {
  email: PropTypes.string.isRequired,
  size: PropTypes.string
}

Avatar.defaultProps = {
  size: '20vw'
}

export default Avatar

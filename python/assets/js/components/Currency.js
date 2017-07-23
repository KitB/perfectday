import React from 'react'
import PropTypes from 'prop-types'

import numeral from 'numeral'

const unitStyle = {
  fontFamily: 'ubuntu mono',
  letterSpacing: '-0.17ch',
}

const fmt = '0,0.00'

const Currency = ({ value  }) => (
  <div>
    {numeral(value).format(fmt)}<span style={unitStyle}>pd</span>
  </div>
)

Currency.propTypes = {
  value: PropTypes.number.isRequired,
}

export default Currency

import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'

import { actions } from 'Store/Ducks'

import RawHeader from 'common/Header'

const Header = ({setShort, setLong, shortDesc, longDesc}) => (
    <RawHeader>
        <TextField
            id='short_description'
            label='Short Description'
            onChange={(e) => setShort(e.target.value)}
            value={shortDesc}
            marginForm
        />
        <TextField
            id='long_description'
            label='Long Description'
            type='text'
            onChange={(e) => setLong(e.target.value)}
            value={longDesc}
            marginForm
            multiline
            rowsMax='2'
            fullWidth
        />
    </RawHeader>
)

Header.propTypes = {
    setShort: PropTypes.func.isRequired,
    shortDesc: PropTypes.string.isRequired,
    setLong: PropTypes.func.isRequired,
    longDesc: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => {
    const habit = state.pd.habits.get('new')
    return {
        shortDesc: habit.short_description,
        longDesc: habit.long_description,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShort: (desc) => dispatch(actions.habits.update.shortDescription.set('new', desc)),
    setLong: (desc) => dispatch(actions.habits.update.longDescription.set('new', desc)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header)

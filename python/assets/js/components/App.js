import React from 'react'
import VisibleHabitList from '../containers/VisibleHabitList'
import Header from '../components/Header'
import PropTypes from 'prop-types'
import PerfectDay from '../PD'


const App = ({apiClient}) => {
    return (
            <div>
                <Header />
                <VisibleHabitList apiClient={apiClient} />
            </div>
    )
}
App.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay).isRequired,
}

export default App

import React from 'react'
import { Fragment } from 'redux-little-router'
import VisibleHabitList from '../containers/VisibleHabitList'
import Header from '../components/Header'
import PropTypes from 'prop-types'
import PerfectDay from '../PD'


const Home = ({apiClient}) => (
    <div>
        <Header />
        <VisibleHabitList apiClient={apiClient} />
    </div>
)
Home.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay).isRequired,
}


const App = ({apiClient}) => (
    <div>
        <Fragment forRoute='/home/'>
            <Home apiClient={apiClient} />
        </Fragment>
        <Fragment forRoute='/habit/:id'>
            <div>
            HABIT
            </div>
        </Fragment>
    </div>
)

App.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay).isRequired,
}

export default App

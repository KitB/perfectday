import React from 'react'
import VisibleHabitList from '../containers/VisibleHabitList'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import PerfectDay from '../PD'


const App = ({apiClient}) => {
    console.log(apiClient)
    return (
        <MuiThemeProvider>
            <div>
                <VisibleHabitList apiClient={apiClient} />
            </div>
        </MuiThemeProvider>
    )
}
App.propTypes = {
    apiClient: PropTypes.instanceOf(PerfectDay)
}

export default App

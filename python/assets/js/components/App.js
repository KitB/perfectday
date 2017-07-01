import React from 'react'
import VisibleHabitList from '../containers/VisibleHabitList'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const App = () => {
    return (
        <MuiThemeProvider>
            <div>
                <VisibleHabitList />
            </div>
        </MuiThemeProvider>
    )
}

export default App

import '../css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import User from './User'

injectTapEventPlugin();

console.log(client);


class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <User person={this.props.person} habits={this.props.habits}/>
      </MuiThemeProvider>
    )
  }
}

client.action(schema, ['people', 'read'], {'id': 'me'}).then(function(person) {
  client.action(schema, ['habits', 'list'], {'person': person.id}).then(function(habits){
    console.log(person);
    console.log(habits.results);
    ReactDOM.render(
        <App person={person} habits={habits.results} />,
        document.getElementById('root')
    );
  })
});




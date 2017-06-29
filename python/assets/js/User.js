import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'
import CheckBox from 'material-ui/Checkbox'


class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {person: props.person, habits: props.habits};
    console.log(this.state);
  }
  render() {
    return (
        <div>
          <AppBar
            title={this.state.person.user.username}
          />
          <Card>
            <CardHeader
              title={this.state.person.user.username}
              subtitle={this.state.person.worth + 'pd'}
            />
            <List>
              {this.state.habits.map((habit) =>
                  <ListItem key={habit.url}>
                    <CheckBox label={habit.short_description}
                    onCheck={this.handleCheck(habit)}
                    checked={habit.happened_today}
                    />
                  </ListItem>
               )}
            </List>
          </Card>
        </div>
    );
  }

  handleCheck(habit) {
    var self = this
    var inner = function(e, checked) {
      if (checked) {
        var action = 'create';
        var args = {'habit': habit.url, 'when': 0};
      } else {
        var action = 'delete';
        var args = {'id': habit.today_action_id};
      }
      e.persist();
      client.action(schema, ['actions', action], args).then(function(response) {
        self.getHabits();
      });
    }
    return inner;
  }

  getHabits() {
    var self = this
    console.log('getting habits');
    client.action(schema, ['habits', 'list'], {person: this.state.person.id}).then(function(response) {
      console.log(response);
      self.setState({
        person: self.state.person,
        habits: response.results
      });
    })
  }
}

export default User

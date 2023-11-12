import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from '../App';
import ProjectList from '../project/ProjectList';
import NewProject from '../project/NewProject';
import EditProject from '../project/EditProject';
import PersonList from '../person/PersonList';
import EditPerson from '../person/EditPerson';
import AddPerson from '../person/AddPerson';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/project-list" component={ProjectList} />
        <Route path="/new-project" component={NewProject} />
        <Route path="/edit-project/:id" component={EditProject} />
        <Route path="/person-list" component={PersonList} />
        <Route path="/edit-person/:id" component={EditPerson} />
        <Route path="/add-person" component={AddPerson} />
      </Switch>
    </Router>
  );
}

export default Routes;

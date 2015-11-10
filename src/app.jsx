import React from 'react';
import { Router, Route } from 'react-router';
import GameTable from './components/GameTable';

const NoMatch = React.createClass({
  render() { return <div>Route not Found</div>; }
});

React.render((
  <Router>
    <Route path="/" component={GameTable}>
        <Route path="league/:leagueName" component={GameTable} />
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>

), document.getElementById('app-container'));

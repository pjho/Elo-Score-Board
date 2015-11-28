import React from 'react';
import { Router, Route } from 'react-router';
import { GameTable } from './components/GameTable';
import { PlayerDash } from './components/PlayerDash'
import createBrowserHistory from 'history/lib/createBrowserHistory'


const NoMatch = React.createClass({
  render() { return <div>Route not Found</div>; }
});

React.render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={GameTable}>
      <Route path="league/:leagueName" component={GameTable} />
      <Route path="edit" component={GameTable} />
    </Route>
    <Route path="player/:playerId" component={PlayerDash} />
    <Route path="*" component={NoMatch}/>
  </Router>
, document.getElementById('app-container'));

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { App } from './components/App';
import { GameTable } from './components/GameTable';
import { PlayerDash } from './components/PlayerDash'
import createBrowserHistory from 'history/lib/createBrowserHistory'

const NoMatch = React.createClass({
  render() { return <div>Route not Found</div>; }
});

render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={GameTable} />
      <Route path="edit" component={GameTable} />
      <Route path="league/:leagueName" component={GameTable} />
      <Route path="league/:leagueName/edit" component={GameTable} />
      <Route path="player/:playerId" component={PlayerDash} />
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>
, document.getElementById('app-container'));

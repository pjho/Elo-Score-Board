import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, applyRouterMiddleware, browserHistory } from 'react-router';
import useScroll from 'react-router-scroll';
import { App } from './components/App';
import { GameTable } from './components/GameTable';
import { PlayerDash } from './components/PlayerDash';
import { AddPlayer } from './components/AddPlayer';

const NoMatch = () => (<div>Route not Found</div>);

render(
  <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route path="/" component={App}>
      <IndexRoute component={GameTable} />
      <Route path="add" component={AddPlayer} />
      <Route path="all" component={GameTable} />
      <Route path="all/edit" component={GameTable} />
      <Route path="edit" component={GameTable} />
      <Route path="edit/all" component={GameTable} />
      <Route path="league/:leagueName" component={GameTable} />
      <Route path="league/:leagueName/all" component={GameTable} />
      <Route path="league/:leagueName/add" component={AddPlayer} />
      <Route path="league/:leagueName/edit" component={GameTable} />
      <Route path="league/:leagueName/all/edit" component={GameTable} />
      <Route path="league/:leagueName/edit/all" component={GameTable} />
      <Route path="league/:league/player/:playerId" component={PlayerDash} />
      <Route path="league/:league/player/:playerId/days/:days" component={PlayerDash} />
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
, document.getElementById('app-container'));




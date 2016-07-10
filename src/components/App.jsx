import React from 'react';
import FirebaseLib from '../utils/FirebaseLib.js';
import attachFastClick from "fastclick";
import { Icon } from './common/icon';
import { Loader } from './common/loader';
import { Menu } from './app/menu';
import _map from 'lodash.map';
import _sortBy from 'lodash.sortby';
import _uniq from 'lodash.uniq';
import conf from '../../firebase.json';

const urlHelper = () => {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const fragments = path.split('/').filter(it => !!it);

  return {
    all: fragments.indexOf('all') > -1,
    edit: fragments.indexOf('edit') > -1,
    with: (frag, after) => '/' + [...fragments, frag].join('/'),
    without: (frag) => '/' + fragments.filter((it) => it !== frag).join('/')
  }
}

export const App =  React.createClass({
  urlHelper: urlHelper(),

  getInitialState() {
    return {
      players: [],
      leagues: [],
      loaded: false,
      authed: false,
      menuOpen: false
    }
  },

  componentWillReceiveProps(nextProps) {
    this.urlHelper = urlHelper();
  },

  componentWillMount() {
    this.firebase = new FirebaseLib(conf);

    this.loadPlayerData();

    this.firebase.checkAuth((authed) => {
      this.setState({ authed: authed })
    });

    attachFastClick(document.body);
  },

  render() {
    let {loaded, authed, players, menuOpen, leagues} = this.state;
    let {leagueName} = this.props.params;

    return (
      <div className={ `AppWrapper ${ !loaded ? 'loading' : '' }` }>
        { !loaded && <Loader /> }

        <Menu authed={authed}
          leagues={leagues}
          doLogin={this.doLogin}
          doLogout={this.doLogout}
          toggleMenu={this.toggleMenu}
          open={menuOpen}
          leagueName={leagueName}
          rootComponent={this.props.children.type.displayName}
          _url={this.urlHelper}
        />

        <div id="EloApp" className={`EloApp container-fluid ${ menuOpen  && "menu-open"}`}>
          {this.props.children && React.cloneElement(this.props.children, {
              authed: authed,
              players: players,
              leagues: leagues,
              firebase: this.firebase,
              _url: this.urlHelper
            })}
        </div>
      </div>
    );
  },


  loadPlayerData() {
    this.firebase.getPlayers((rawItems) => {

      let items = _map(rawItems.val(), (item, k) => {
        item.id = k;
        return item;
      });

      const sorted = _sortBy(items, (item) => -item.score );

      let leagues = _uniq( _map( sorted, 'league') ).sort();

      this.setState({
        players: sorted,
        leagues: leagues,
        loaded: true
      });

    });
  },

  doLogout() {
    this.firebase.doLogout();
    this.setState({ authed: false });
  },

  doLogin() {
    let user = conf.globalUser || prompt('Enter your Username/Email address.');
    let pass = prompt('Enter your password');

    if(!user || !pass) { return; }
    this.setState({loaded:false});
    this.firebase.doLogin( user, pass, function(authed, msg) {
      if (msg) { alert(msg); };
      this.setState({ authed: authed, loaded:true });
    }.bind(this) );
  },

  toggleMenu() {
    // document.body.classList.toggle("scroll-lock");
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }
});

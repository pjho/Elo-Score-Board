import React from 'react';
import ReactFire from 'reactfire';
import FirebaseLib from '../utils/FirebaseLib.js';
import { Icon } from './common/icon';
import { Menu } from './app/menu';
import _ from 'lodash';
import conf from '../../firebase.json';


export const App =  React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      leagues: [],
      loaded: false,
      authed: false,
      menuOpen: false
    }
  },

  componentWillMount() {
    this.firebase = new FirebaseLib(conf.firebase);
    this.loadPlayerData();

    this.setState({
      authed: this.firebase.authed(),
    })
  },

  render() {
    let {loaded, authed, players, menuOpen, leagues} = this.state;
    let {leagueName} = this.props.params;

    return (
      <div className={ `AppWrapper ${ !loaded ? 'loading' : '' }` }>

        <Menu authed={authed}
          leagues={leagues}
          doLogin={this.doLogin}
          doLogout={this.doLogout}
          toggleMenu={this.toggleMenu}
          open={menuOpen}
          leagueName={leagueName}
          rootComponent={this.props.children.type.displayName}
        />

        <div id="EloApp" className={`EloApp container-fluid ${ menuOpen  && "menu-open"}`}>
          {this.props.children && React.cloneElement(this.props.children, {
              authed: authed,
              players: players,
              leagues: leagues,
              firebase: this.firebase
              // doLogin: this.doLogin,
              // doLogout: this.doLogout,
            })}
        </div>
      </div>
    );
  },

  loadPlayerData() {
    // this.bindAsArray(ref, "items");

    this.firebase.dataOn('value', (rawItems) => {
      let items = [];
      let sorted = [];

      rawItems.forEach( (rawItem) => {
        var item = rawItem.val();
        item.id = rawItem.key();
        items.push(item);
      });

      sorted = _.sortBy(items, (item) => {
        return -item.score;
      });

      let leagues = _.uniq( _.pluck( sorted, 'league') ).sort();

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

    this.firebase.doLogin( user, pass, function(authed, msg) {
      if (msg) { alert(msg); };
      this.setState({ authed: authed });
    }.bind(this) );
  },

  toggleMenu() {
    // document.body.classList.toggle("scroll-lock");
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }
});
